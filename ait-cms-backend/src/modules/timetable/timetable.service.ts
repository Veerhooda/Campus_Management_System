import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateTimetableSlotDto, UpdateTimetableSlotDto } from './dto';

@Injectable()
export class TimetableService {
  private readonly logger = new Logger(TimetableService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create timetable slot with conflict detection
   */
  async createSlot(dto: CreateTimetableSlotDto) {
    // Validate time
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for conflicts
    const conflicts = await this.checkConflicts(dto);
    if (conflicts.length > 0) {
      throw new ConflictException({
        message: 'Timetable conflicts detected',
        conflicts,
      });
    }

    const slot = await this.prisma.timetableSlot.create({
      data: dto,
      include: {
        class: { include: { department: true } },
        subject: true,
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
      },
    });

    this.logger.log(`Timetable slot created: ${slot.id}`);
    return slot;
  }

  /**
   * Check for timetable conflicts
   */
  private async checkConflicts(dto: CreateTimetableSlotDto, excludeId?: string) {
    const conflicts: string[] = [];

    // Check class conflict (same class at same time)
    const classConflict = await this.prisma.timetableSlot.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        classId: dto.classId,
        dayOfWeek: dto.dayOfWeek,
        OR: [
          { AND: [{ startTime: { lte: dto.startTime } }, { endTime: { gt: dto.startTime } }] },
          { AND: [{ startTime: { lt: dto.endTime } }, { endTime: { gte: dto.endTime } }] },
          { AND: [{ startTime: { gte: dto.startTime } }, { endTime: { lte: dto.endTime } }] },
        ],
      },
    });

    if (classConflict) {
      conflicts.push('Class already has a scheduled session at this time');
    }

    // Check teacher conflict
    const teacherConflict = await this.prisma.timetableSlot.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        OR: [
          { AND: [{ startTime: { lte: dto.startTime } }, { endTime: { gt: dto.startTime } }] },
          { AND: [{ startTime: { lt: dto.endTime } }, { endTime: { gte: dto.endTime } }] },
          { AND: [{ startTime: { gte: dto.startTime } }, { endTime: { lte: dto.endTime } }] },
        ],
      },
    });

    if (teacherConflict) {
      conflicts.push('Teacher already has a scheduled session at this time');
    }

    // Check room conflict
    const roomConflict = await this.prisma.timetableSlot.findFirst({
      where: {
        id: excludeId ? { not: excludeId } : undefined,
        roomId: dto.roomId,
        dayOfWeek: dto.dayOfWeek,
        OR: [
          { AND: [{ startTime: { lte: dto.startTime } }, { endTime: { gt: dto.startTime } }] },
          { AND: [{ startTime: { lt: dto.endTime } }, { endTime: { gte: dto.endTime } }] },
          { AND: [{ startTime: { gte: dto.startTime } }, { endTime: { lte: dto.endTime } }] },
        ],
      },
    });

    if (roomConflict) {
      conflicts.push('Room already booked at this time');
    }

    return conflicts;
  }

  /**
   * Get timetable for a class
   */
  async getTimetableByClass(classId: string) {
    const slots = await this.prisma.timetableSlot.findMany({
      where: { classId },
      include: {
        subject: true,
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return this.groupByDay(slots);
  }

  /**
   * Get timetable for a teacher
   */
  async getTimetableByTeacher(teacherId: string) {
    const slots = await this.prisma.timetableSlot.findMany({
      where: { teacherId },
      include: {
        class: { include: { department: true } },
        subject: true,
        room: true,
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return this.groupByDay(slots);
  }

  /**
   * Get timetable for a room
   */
  async getTimetableByRoom(roomId: string) {
    const slots = await this.prisma.timetableSlot.findMany({
      where: { roomId },
      include: {
        class: { include: { department: true } },
        subject: true,
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return this.groupByDay(slots);
  }

  /**
   * Get slot by ID
   */
  async getSlotById(id: string) {
    const slot = await this.prisma.timetableSlot.findUnique({
      where: { id },
      include: {
        class: { include: { department: true } },
        subject: true,
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
      },
    });

    if (!slot) {
      throw new NotFoundException('Timetable slot not found');
    }

    return slot;
  }

  /**
   * Update timetable slot
   */
  async updateSlot(id: string, dto: UpdateTimetableSlotDto) {
    const existing = await this.prisma.timetableSlot.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Timetable slot not found');
    }

    const mergedDto = {
      ...existing,
      ...dto,
    };

    if (mergedDto.startTime >= mergedDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    const conflicts = await this.checkConflicts(mergedDto as CreateTimetableSlotDto, id);
    if (conflicts.length > 0) {
      throw new ConflictException({
        message: 'Timetable conflicts detected',
        conflicts,
      });
    }

    const updated = await this.prisma.timetableSlot.update({
      where: { id },
      data: dto,
      include: {
        class: { include: { department: true } },
        subject: true,
        teacher: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
      },
    });

    this.logger.log(`Timetable slot updated: ${id}`);
    return updated;
  }

  /**
   * Delete timetable slot
   */
  async deleteSlot(id: string) {
    await this.prisma.timetableSlot.delete({
      where: { id },
    });

    this.logger.log(`Timetable slot deleted: ${id}`);
    return { message: 'Timetable slot deleted successfully' };
  }

  /**
   * Get all classes (for admin lookups)
   */
   /**
   * Get all classes (filtered for faculty)
   */
  async getAllClasses(user?: any) {
    let where = {};

    // If teacher, filter by their department
    if (user && user.teacherProfile) {
      where = { departmentId: user.teacherProfile.departmentId };
    }

    return this.prisma.class.findMany({
      where,
      include: { department: true },
      orderBy: [{ department: { name: 'asc' } }, { year: 'asc' }, { section: 'asc' }],
    });
  }

  /**
   * Get all subjects (for admin lookups)
   */
  async getAllSubjects() {
    return this.prisma.subject.findMany({
      include: { department: true },
      orderBy: [{ department: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  /**
   * Get all rooms (for admin lookups)
   */
  async getAllRooms() {
    return this.prisma.room.findMany({
      orderBy: [{ building: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Group slots by day of week
   */
  private groupByDay(slots: any[]) {
    const grouped: Record<string, any[]> = {};

    for (const day of Object.values(DayOfWeek)) {
      grouped[day] = slots.filter((s) => s.dayOfWeek === day);
    }

    return grouped;
  }
}
