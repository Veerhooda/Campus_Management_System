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
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TeachersService } from './teachers.service';
import { CreateTeacherProfileDto, UpdateTeacherProfileDto, ToggleCounsellorDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('teachers')
export class TeachersController {
  private readonly logger = new Logger(TeachersController.name);

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

  @Get('my-subjects')
  @Roles(Role.TEACHER)
  async getMySubjects(@CurrentUser('id') userId: string) {
    return this.teachersService.getMySubjects(userId);
  }

  @Get('department/:departmentId')
  @Roles(Role.ADMIN, Role.TEACHER)
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

  // --- Counselling Endpoints ---

  @Patch(':id/counsellor')
  @Roles(Role.ADMIN)
  async toggleCounsellor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ToggleCounsellorDto,
  ) {
    this.logger.log(`Toggling counsellor status for teacher ${id}. Payload: ${JSON.stringify(dto)}`);
    return this.teachersService.toggleCounsellorStatus(id, dto.status);
  }

  @Get('me/mentees')
  @Roles(Role.TEACHER)
  async getMyMentees(@CurrentUser('id') userId: string) {
    const teacher = await this.teachersService.findByUserId(userId);
    return this.teachersService.getMentees(teacher.id);
  }
}
