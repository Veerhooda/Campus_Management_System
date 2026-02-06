import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { TicketStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateGrievanceDto, UpdateGrievanceDto } from './dto';

@Injectable()
export class GrievancesService {
  private readonly logger = new Logger(GrievancesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGrievanceDto, submittedById: string) {
    const grievance = await this.prisma.grievance.create({
      data: {
        title: dto.title,
        description: dto.description,
        submittedById,
      },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`Grievance created: ${grievance.id}`);
    return grievance;
  }

  async findAll(page = 1, limit = 20, status?: TicketStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [grievances, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where,
        skip,
        take: limit,
        include: {
          submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
          assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.grievance.count({ where }),
    ]);

    return {
      data: grievances,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, userId: string, userRoles: Role[]) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }

    // Only admin or the submitter can view
    if (!userRoles.includes(Role.ADMIN) && grievance.submittedById !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return grievance;
  }

  async findMyGrievances(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [grievances, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where: { submittedById: userId },
        skip,
        take: limit,
        include: {
          assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.grievance.count({ where: { submittedById: userId } }),
    ]);

    return {
      data: grievances,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, dto: UpdateGrievanceDto) {
    const existing = await this.prisma.grievance.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Grievance not found');
    }

    const updateData: any = { ...dto };
    if (dto.status === TicketStatus.RESOLVED) {
      updateData.resolvedAt = new Date();
    }

    const updated = await this.prisma.grievance.update({
      where: { id },
      data: updateData,
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    this.logger.log(`Grievance updated: ${id}`);
    return updated;
  }

  async assign(id: string, assignedToId: string) {
    const updated = await this.prisma.grievance.update({
      where: { id },
      data: {
        assignedToId,
        status: TicketStatus.IN_PROGRESS,
      },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    this.logger.log(`Grievance ${id} assigned to ${assignedToId}`);
    return updated;
  }

  async resolve(id: string, resolution: string) {
    const updated = await this.prisma.grievance.update({
      where: { id },
      data: {
        status: TicketStatus.RESOLVED,
        resolvedAt: new Date(),
      },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });

    this.logger.log(`Grievance resolved: ${id}`);
    return updated;
  }

  async delete(id: string) {
    await this.prisma.grievance.delete({
      where: { id },
    });

    this.logger.log(`Grievance deleted: ${id}`);
    return { message: 'Grievance deleted successfully' };
  }
}
