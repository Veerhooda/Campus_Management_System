import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { TimetableService } from './timetable.service';
import { CreateTimetableSlotDto, UpdateTimetableSlotDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  /**
   * GET /api/v1/timetable/lookup/classes
   * Get all classes for dropdowns (Admin)
   */
  @Get('lookup/classes')
  @Roles(Role.ADMIN)
  async getClasses() {
    return this.timetableService.getAllClasses();
  }

  /**
   * GET /api/v1/timetable/lookup/subjects
   * Get all subjects for dropdowns (Admin)
   */
  @Get('lookup/subjects')
  @Roles(Role.ADMIN)
  async getSubjects() {
    return this.timetableService.getAllSubjects();
  }

  /**
   * GET /api/v1/timetable/lookup/rooms
   * Get all rooms for dropdowns (Admin)
   */
  @Get('lookup/rooms')
  @Roles(Role.ADMIN)
  async getRooms() {
    return this.timetableService.getAllRooms();
  }

  /**
   * POST /api/v1/timetable
   * Create new slot (Admin only)
   */
  @Post()
  @Roles(Role.ADMIN)
  async createSlot(@Body() dto: CreateTimetableSlotDto) {
    return this.timetableService.createSlot(dto);
  }

  /**
   * GET /api/v1/timetable/class/:classId
   * Get timetable for class (All authenticated)
   */
  @Get('class/:classId')
  async getByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return this.timetableService.getTimetableByClass(classId);
  }

  /**
   * GET /api/v1/timetable/teacher/:teacherId
   * Get timetable for teacher (Admin, Teacher)
   */
  @Get('teacher/:teacherId')
  @Roles(Role.ADMIN, Role.TEACHER)
  async getByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
    return this.timetableService.getTimetableByTeacher(teacherId);
  }

  /**
   * GET /api/v1/timetable/room/:roomId
   * Get timetable for room (Admin)
   */
  @Get('room/:roomId')
  @Roles(Role.ADMIN)
  async getByRoom(@Param('roomId', ParseUUIDPipe) roomId: string) {
    return this.timetableService.getTimetableByRoom(roomId);
  }

  /**
   * GET /api/v1/timetable/slot/:id
   * Get specific slot (Admin)
   */
  @Get('slot/:id')
  @Roles(Role.ADMIN)
  async getSlotById(@Param('id', ParseUUIDPipe) id: string) {
    return this.timetableService.getSlotById(id);
  }

  /**
   * PATCH /api/v1/timetable/slot/:id
   * Update slot (Admin only)
   */
  @Patch('slot/:id')
  @Roles(Role.ADMIN)
  async updateSlot(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTimetableSlotDto,
  ) {
    return this.timetableService.updateSlot(id, dto);
  }

  /**
   * DELETE /api/v1/timetable/slot/:id
   * Delete slot (Admin only)
   */
  @Delete('slot/:id')
  @Roles(Role.ADMIN)
  async deleteSlot(@Param('id', ParseUUIDPipe) id: string) {
    return this.timetableService.deleteSlot(id);
  }
}
