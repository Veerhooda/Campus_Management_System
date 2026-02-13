
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateSessionDto } from './dto/counselling.dto';

@Injectable()
export class CounsellingService {
  private readonly logger = new Logger(CounsellingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createSessionForUser(userId: string, dto: CreateSessionDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) throw new BadRequestException('Teacher profile not found');
    
    // @ts-ignore: Schema update pending
    if (!teacher.isCounsellor) throw new BadRequestException('You are not a registered counsellor');

    return this.createSession(teacher.id, dto);
  }

  async getSessionsForStudentUser(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });
    if (!student) throw new BadRequestException('Student profile not found');
    return this.getSessionsByStudent(student.id);
  }

  async getSessionsForCounsellorUser(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });
    if (!teacher) throw new BadRequestException('Teacher profile not found');
    return this.getSessionsByCounsellor(teacher.id);
  }

  async createSession(counsellorId: string, dto: CreateSessionDto) {
    // Verify relation (is this student assigned to this counsellor?)
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) throw new NotFoundException('Student not found');
    
    // @ts-ignore: Schema update pending
    if (student.counsellorId !== counsellorId) {
      throw new BadRequestException('You can only log sessions for your assigned mentees');
    }

    // @ts-ignore: Schema update pending
    const session = await this.prisma.counsellingSession.create({
      data: {
        counsellorId,
        studentId: dto.studentId,
        notes: dto.notes,
        actionItems: dto.actionItems,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });

    // @ts-ignore: Schema update pending
    this.logger.log(`Counselling session created: ${session.id}`);
    return session;
  }

  async getSessionsByStudent(studentId: string) {
    // @ts-ignore: Schema update pending
    return this.prisma.counsellingSession.findMany({
      where: { studentId },
      include: {
        counsellor: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getSessionsByCounsellor(counsellorId: string) {
      // @ts-ignore: Schema update pending
      return this.prisma.counsellingSession.findMany({
        where: { counsellorId },
        include: {
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
      });
  }
}
