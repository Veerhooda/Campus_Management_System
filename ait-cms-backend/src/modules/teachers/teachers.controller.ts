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
import { TeachersService } from './teachers.service';
import { CreateTeacherProfileDto, UpdateTeacherProfileDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post(':userId')
  @Roles(Role.ADMIN)
  async createProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateTeacherProfileDto,
  ) {
    return this.teachersService.createProfile(userId, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.teachersService.findAll(page, limit);
  }

  @Get('me')
  @Roles(Role.TEACHER)
  async getOwnProfile(@CurrentUser('id') userId: string) {
    return this.teachersService.findByUserId(userId);
  }

  @Get('department/:departmentId')
  @Roles(Role.ADMIN)
  async findByDepartment(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.teachersService.findByDepartment(departmentId, page, limit);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherProfileDto,
  ) {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.remove(id);
  }
}
