import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../../prisma';
import { JwtPayload } from '../../../common/types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('jwt.refreshSecret');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // Verify token type
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    // Verify refresh token exists in database and hasn't expired
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: {
          include: {
            roles: {
              select: { role: true },
            },
          },
        },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Return user object and refresh token for rotation
    return {
      id: storedToken.user.id,
      email: storedToken.user.email,
      roles: storedToken.user.roles.map((r) => r.role),
      refreshToken: storedToken.token,
      refreshTokenId: storedToken.id,
    };
  }
}
