import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { BulkAttendanceDto } from './dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mark attendance in bulk for a class session
   */
  async markBulkAttendance(dto: BulkAttendanceDto, markedById: string) {
    // Get teacher profile by user ID
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: markedById },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const date = new Date(dto.date);

    // Create or update attendance records
    const results = await this.prisma.$transaction(
      dto.attendance.map((record) =>
        this.prisma.attendance.upsert({
          where: {
            date_studentId_subjectId: {
              studentId: record.studentId,
              subjectId: dto.timetableSlotId, // Using slot as subject reference
              date,
            },
          },
          update: {
            isPresent: record.present,
            markedById: teacher.id,
          },
          create: {
            studentId: record.studentId,
            subjectId: dto.timetableSlotId,
            date,
            isPresent: record.present,
            markedById: teacher.id,
          },
        }),
      ),
    );

    this.logger.log(`Marked attendance for ${results.length} students`);
    return { message: `Attendance marked for ${results.length} students`, count: results.length };
  }

  /**
   * Get attendance for a student
   */
  async getStudentAttendance(studentId: string, startDate?: string, endDate?: string) {
    const where: any = { studentId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const records = await this.prisma.attendance.findMany({
      where,
      include: {
        subject: true,
        markedBy: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { date: 'desc' },
    });

    const totalClasses = records.length;
    const presentCount = records.filter((r) => r.isPresent).length;
    const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return {
      records,
      summary: {
        totalClasses,
        present: presentCount,
        absent: totalClasses - presentCount,
        percentage,
      },
    };
  }

  /**
   * Get attendance for a class on a date
   */
  async getClassAttendance(classId: string, date: string) {
    const targetDate = new Date(date);

    // Get all students in class first
    const students = await this.prisma.student.findMany({
      where: { classId },
      include: {
        user: { select: { firstName: true, lastName: true } },
        attendanceRecords: {
          where: { date: targetDate },
          include: { subject: true },
        },
      },
      orderBy: { rollNumber: 'asc' },
    });

    return students;
  }

  /**
   * Get attendance by subject for a student
   */
  async getSubjectAttendance(studentId: string, subjectId: string) {
    const records = await this.prisma.attendance.findMany({
      where: {
        studentId,
        subjectId,
      },
      include: {
        subject: true,
      },
      orderBy: { date: 'desc' },
    });

    const totalClasses = records.length;
    const presentCount = records.filter((r) => r.isPresent).length;
    const percentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return {
      records,
      summary: {
        totalClasses,
        present: presentCount,
        absent: totalClasses - presentCount,
        percentage,
      },
    };
  }

  /**
   * Get attendance summary for a class
   */
  async getClassAttendanceSummary(classId: string, startDate?: string, endDate?: string) {
    // Get all students in class
    const students = await this.prisma.student.findMany({
      where: { classId },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    const where: any = {
      studentId: { in: students.map((s) => s.id) },
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const records = await this.prisma.attendance.findMany({
      where,
    });

    // Group by student
    const studentMap = new Map<string, { total: number; present: number }>();

    for (const record of records) {
      const existing = studentMap.get(record.studentId);
      if (existing) {
        existing.total++;
        if (record.isPresent) existing.present++;
      } else {
        studentMap.set(record.studentId, {
          total: 1,
          present: record.isPresent ? 1 : 0,
        });
      }
    }

    const summary = students.map((student) => {
      const stats = studentMap.get(student.id) || { total: 0, present: 0 };
      return {
        student: { ...student },
        totalClasses: stats.total,
        present: stats.present,
        absent: stats.total - stats.present,
        percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
      };
    });

    return summary.sort((a, b) => a.percentage - b.percentage);
  }
}
