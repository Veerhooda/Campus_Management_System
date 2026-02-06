import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma';
import { JwtPayload } from '../../../common/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('jwt.accessSecret');
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    // Verify token type
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Verify user exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Return user object that will be attached to request
    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role),
    };
  }
}
