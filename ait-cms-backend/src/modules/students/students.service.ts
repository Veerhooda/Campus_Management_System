import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateStudentProfileDto, UpdateStudentProfileDto } from './dto';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create student profile for existing user
   */
  async createProfile(userId: string, dto: CreateStudentProfileDto) {
    // Check user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.studentProfile) {
      throw new ConflictException('Student profile already exists');
    }

    // Check roll number uniqueness
    const existingRoll = await this.prisma.student.findUnique({
      where: { rollNumber: dto.rollNumber },
    });

    if (existingRoll) {
      throw new ConflictException('Roll number already in use');
    }

    const profile = await this.prisma.student.create({
      data: {
        userId,
        rollNumber: dto.rollNumber,
        enrollmentYear: dto.enrollmentYear,
        classId: dto.classId,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        class: { include: { department: true } },
      },
    });

    this.logger.log(`Student profile created for user: ${userId}`);
    return profile;
  }

  /**
   * Get all students with pagination
   */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, isActive: true } },
          class: { include: { department: true } },
        },
        orderBy: { rollNumber: 'asc' },
      }),
      this.prisma.student.count(),
    ]);

    return {
      data: students,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get student by ID
   */
  async findById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true } },
        class: { include: { department: true } },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  /**
   * Get student by user ID
   */
  async findByUserId(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true } },
        class: { include: { department: true } },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return student;
  }

  /**
   * Get students by class
   */
  async findByClass(classId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      this.prisma.student.findMany({
        where: { classId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, isActive: true } },
        },
        orderBy: { rollNumber: 'asc' },
      }),
      this.prisma.student.count({ where: { classId } }),
    ]);

    return {
      data: students,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Update student profile
   */
  async update(id: string, dto: UpdateStudentProfileDto) {
    const existing = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Student not found');
    }

    // Check roll number uniqueness if changing
    if (dto.rollNumber && dto.rollNumber !== existing.rollNumber) {
      const existingRoll = await this.prisma.student.findUnique({
        where: { rollNumber: dto.rollNumber },
      });

      if (existingRoll) {
        throw new ConflictException('Roll number already in use');
      }
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        class: { include: { department: true } },
      },
    });

    this.logger.log(`Student profile updated: ${id}`);
    return updated;
  }

  /**
   * Delete student profile
   */
  async remove(id: string) {
    await this.prisma.student.delete({
      where: { id },
    });

    this.logger.log(`Student profile deleted: ${id}`);
    return { message: 'Student profile deleted successfully' };
  }
}
