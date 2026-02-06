import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateTeacherProfileDto, UpdateTeacherProfileDto } from './dto';

@Injectable()
export class TeachersService {
  private readonly logger = new Logger(TeachersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateTeacherProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { teacherProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.teacherProfile) {
      throw new ConflictException('Teacher profile already exists');
    }

    const existingEmp = await this.prisma.teacher.findUnique({
      where: { employeeId: dto.employeeId },
    });

    if (existingEmp) {
      throw new ConflictException('Employee ID already in use');
    }

    const profile = await this.prisma.teacher.create({
      data: {
        userId,
        employeeId: dto.employeeId,
        departmentId: dto.departmentId,
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        department: true,
      },
    });

    this.logger.log(`Teacher profile created for user: ${userId}`);
    return profile;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, isActive: true } },
          department: true,
        },
        orderBy: { employeeId: 'asc' },
      }),
      this.prisma.teacher.count(),
    ]);

    return {
      data: teachers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true } },
        department: true,
        timetableSlots: {
          include: { subject: true, class: true, room: true },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async findByUserId(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } },
        department: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    return teacher;
  }

  async findByDepartment(departmentId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      this.prisma.teacher.findMany({
        where: { departmentId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true, isActive: true } },
        },
        orderBy: { employeeId: 'asc' },
      }),
      this.prisma.teacher.count({ where: { departmentId } }),
    ]);

    return {
      data: teachers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, dto: UpdateTeacherProfileDto) {
    const existing = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Teacher not found');
    }

    if (dto.employeeId && dto.employeeId !== existing.employeeId) {
      const existingEmp = await this.prisma.teacher.findUnique({
        where: { employeeId: dto.employeeId },
      });

      if (existingEmp) {
        throw new ConflictException('Employee ID already in use');
      }
    }

    const updated = await this.prisma.teacher.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        department: true,
      },
    });

    this.logger.log(`Teacher profile updated: ${id}`);
    return updated;
  }

  async remove(id: string) {
    await this.prisma.teacher.delete({
      where: { id },
    });

    this.logger.log(`Teacher profile deleted: ${id}`);
    return { message: 'Teacher profile deleted successfully' };
  }
}
