import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto';
import { JwtRefreshGuard } from './guards';
import { Public, CurrentUser } from '../../common/decorators';

// Extended user type for refresh endpoint
interface RefreshUser {
  id: string;
  email: string;
  roles: Role[];
  refreshToken: string;
  refreshTokenId: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/v1/auth/login
   * Authenticate user and return tokens
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token using refresh token
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request): Promise<AuthResponseDto> {
    const user = req.user as RefreshUser;
    return this.authService.refreshTokens(
      user.id,
      user.email,
      user.roles,
      user.refreshTokenId,
    );
  }

  /**
   * POST /api/v1/auth/logout
   * Logout current session (invalidate refresh token)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Body() body: { refreshToken?: string } = {},
  ): Promise<{ message: string }> {
    await this.authService.logout(userId, body.refreshToken);
    return { message: 'Successfully logged out' };
  }

  /**
   * POST /api/v1/auth/logout-all
   * Logout from all devices (invalidate all refresh tokens)
   */
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser('id') userId: string,
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(userId);
    return { message: 'Successfully logged out from all devices' };
  }

  /**
   * POST /api/v1/auth/me
   * Get current authenticated user info
   */
  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() user: Express.User): Promise<Express.User> {
    return user;
  }
}
