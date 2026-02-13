import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Roles } from '../../common/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/v1/users
   * Create a new user (Admin only)
   */
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /api/v1/users/stats
   * Get user statistics (Admin only)
   */
  @Get('stats')
  @Roles(Role.ADMIN)
  async getStats() {
    return this.usersService.getStats();
  }

  /**
   * GET /api/v1/users
   * Get all users with pagination (Admin only)
   */
  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findAll(page, limit);
  }

  /**
   * GET /api/v1/users/role/:role
   * Get users by role with pagination (Admin only)
   */
  @Get('role/:role')
  @Roles(Role.ADMIN)
  async findByRole(
    @Param('role') role: Role,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.usersService.findByRole(role, page, limit);
  }

  /**
   * GET /api/v1/users/:id
   * Get user by ID (Admin only)
   */
  @Get(':id')
  @Roles(Role.ADMIN)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  /**
   * PATCH /api/v1/users/:id
   * Update user (Admin only)
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * PATCH /api/v1/users/:id/deactivate
   * Deactivate user (Admin only)
   */
  @Patch(':id/deactivate')
  @Roles(Role.ADMIN)
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivate(id);
  }

  /**
   * PATCH /api/v1/users/:id/reactivate
   * Reactivate user (Admin only)
   */
  @Patch(':id/reactivate')
  @Roles(Role.ADMIN)
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.reactivate(id);
  }

  /**
   * DELETE /api/v1/users/:id
   * Delete user permanently (Admin only)
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
