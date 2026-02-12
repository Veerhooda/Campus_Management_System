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
import { StudentsService } from './students.service';
import { CreateStudentProfileDto, UpdateStudentProfileDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * POST /api/v1/students/:userId
   * Create student profile for user (Admin only)
   */
  @Post(':userId')
  @Roles(Role.ADMIN)
  async createProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateStudentProfileDto,
  ) {
    return this.studentsService.createProfile(userId, dto);
  }

  /**
   * GET /api/v1/students
   * Get all students (Admin, Teacher)
   */
  @Get()
  @Roles(Role.ADMIN, Role.TEACHER)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('departmentId') departmentId?: string,
    @Query('year', new DefaultValuePipe(0), ParseIntPipe) year?: number,
  ) {
    return this.studentsService.findAll(page, limit, departmentId, year === 0 ? undefined : year);
  }

  /**
   * GET /api/v1/students/me
   * Get own student profile (Student only)
   */
  @Get('me')
  @Roles(Role.STUDENT)
  async getOwnProfile(@CurrentUser('id') userId: string) {
    return this.studentsService.findByUserId(userId);
  }

  /**
   * GET /api/v1/students/class/:classId
   * Get students by class (Admin, Teacher)
   */
  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER)
  async findByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.studentsService.findByClass(classId, page, limit);
  }

  /**
   * GET /api/v1/students/:id
   * Get student by ID (Admin, Teacher)
   */
  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findById(id);
  }

  /**
   * PATCH /api/v1/students/:id
   * Update student (Admin only)
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  /**
   * DELETE /api/v1/students/:id
   * Delete student (Admin only)
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}
