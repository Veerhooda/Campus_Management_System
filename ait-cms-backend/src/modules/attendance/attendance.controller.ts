import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { BulkAttendanceDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';
import { PrismaService } from '../../prisma';

@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /api/v1/attendance/bulk
   * Mark attendance for multiple students (Teacher)
   */
  @Post('bulk')
  @Roles(Role.TEACHER, Role.ADMIN)
  async markBulkAttendance(
    @Body() dto: BulkAttendanceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.attendanceService.markBulkAttendance(dto, userId);
  }

  /**
   * GET /api/v1/attendance/student/:studentId
   * Get attendance for a student (Teacher, Admin)
   */
  @Get('student/:studentId')
  @Roles(Role.TEACHER, Role.ADMIN)
  async getStudentAttendance(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, startDate, endDate);
  }

  /**
   * GET /api/v1/attendance/me
   * Get own attendance (Student only)
   */
  @Get('me')
  @Roles(Role.STUDENT)
  async getOwnAttendance(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) throw new Error('Student profile not found');
    return this.attendanceService.getStudentAttendance(student.id, startDate, endDate);
  }

  /**
   * GET /api/v1/attendance/class/:classId
   * Get attendance for a class on a date (Teacher, Admin)
   */
  @Get('class/:classId')
  @Roles(Role.TEACHER, Role.ADMIN)
  async getClassAttendance(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('date') date: string,
  ) {
    return this.attendanceService.getClassAttendance(classId, date);
  }

  /**
   * GET /api/v1/attendance/class/:classId/summary
   * Get attendance summary for a class (Teacher, Admin)
   */
  @Get('class/:classId/summary')
  @Roles(Role.TEACHER, Role.ADMIN)
  async getClassSummary(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getClassAttendanceSummary(classId, startDate, endDate);
  }

  /**
   * GET /api/v1/attendance/subject/:subjectId/student/:studentId
   * Get subject-wise attendance (Teacher, Admin)
   */
  @Get('subject/:subjectId/student/:studentId')
  @Roles(Role.TEACHER, Role.ADMIN)
  async getSubjectAttendance(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
  ) {
    return this.attendanceService.getSubjectAttendance(studentId, subjectId);
  }
}
