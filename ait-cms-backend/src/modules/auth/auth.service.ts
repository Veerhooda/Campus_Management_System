import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { LoginDto, AuthResponseDto } from './dto';
import { JwtPayload, TokenPair } from '../../common/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessTokenExpirationMs: number;
  private readonly refreshTokenExpirationMs: number;
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Parse expiration times to milliseconds
    this.accessTokenExpirationMs = this.parseExpirationToMs(
      this.configService.get<string>('jwt.accessExpiration') || '15m'
    );
    this.refreshTokenExpirationMs = this.parseExpirationToMs(
      this.configService.get<string>('jwt.refreshExpiration') || '7d'
    );
    this.accessSecret = this.configService.getOrThrow<string>('jwt.accessSecret');
    this.refreshSecret = this.configService.getOrThrow<string>('jwt.refreshSecret');
  }

  /**
   * Authenticate user with email and password
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user with roles
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: {
          select: { role: true },
        },
        studentProfile: true, // Add these
        teacherProfile: true,
      },
    });

    if (!user) {
      this.logger.warn(`Login attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      this.logger.warn(`Login attempt for deactivated account: ${email}`);
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const roles = user.roles.map((r: { role: Role }) => r.role);
    const tokens = await this.generateTokens(user.id, user.email, roles);

    // Store refresh token in database
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in successfully: ${email}`);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        studentProfile: user.studentProfile,
        teacherProfile: user.teacherProfile,
      },
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(
    userId: string,
    email: string,
    roles: Role[],
    oldRefreshTokenId: string,
  ): Promise<AuthResponseDto> {
    // Delete old refresh token (rotation)
    await this.prisma.refreshToken.delete({
      where: { id: oldRefreshTokenId },
    });

    // Generate new token pair
    const tokens = await this.generateTokens(userId, email, roles);

    // Store new refresh token
    await this.storeRefreshToken(userId, tokens.refreshToken);

    // Get user data
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    this.logger.log(`Tokens refreshed for user: ${email}`);

    return {
      ...tokens,
      user: {
        ...user,
        roles,
      },
    };
  }

  /**
   * Logout user by invalidating refresh token
   */
  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user (logout from all devices)
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    this.logger.log(`User logged out: ${userId}`);
  }

  /**
   * Logout from all devices
   */
  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    this.logger.log(`User logged out from all devices: ${userId}`);
  }

  /**
   * Hash password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Generate access and refresh token pair
   */
  private async generateTokens(
    userId: string,
    email: string,
    roles: Role[],
  ): Promise<TokenPair> {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      roles,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      roles,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload as unknown as Record<string, unknown>, {
        secret: this.accessSecret,
        expiresIn: Math.floor(this.accessTokenExpirationMs / 1000), // seconds
      }),
      this.jwtService.signAsync(refreshPayload as unknown as Record<string, unknown>, {
        secret: this.refreshSecret,
        expiresIn: Math.floor(this.refreshTokenExpirationMs / 1000), // seconds
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Store refresh token in database
   */
  private async storeRefreshToken(
    userId: string,
    token: string,
  ): Promise<void> {
    // Calculate expiration date
    const expiresAt = new Date(Date.now() + this.refreshTokenExpirationMs);

    await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    // Clean up expired tokens for this user
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });
  }

  /**
   * Parse duration string to milliseconds
   */
  private parseExpirationToMs(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);

    if (!match) {
      // Default to 15 minutes if parsing fails
      return 15 * 60 * 1000;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 15 * 60 * 1000;
    }
  }
}
