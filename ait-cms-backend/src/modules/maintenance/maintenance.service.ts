import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { TicketStatus } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMaintenanceDto, submittedById: string) {
    const ticket = await this.prisma.maintenanceRequest.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location || '',
        priority: dto.priority ? parseInt(dto.priority, 10) : 1,
        submittedById,
      },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`Maintenance request created: ${ticket.id}`);
    return ticket;
  }

  async findAll(page = 1, limit = 20, status?: TicketStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      this.prisma.maintenanceRequest.findMany({
        where,
        skip,
        take: limit,
        include: {
          submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.maintenanceRequest.count({ where }),
    ]);

    return {
      data: tickets,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const ticket = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Maintenance request not found');
    }

    return ticket;
  }

  async findMyTickets(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.prisma.maintenanceRequest.findMany({
        where: { submittedById: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.maintenanceRequest.count({ where: { submittedById: userId } }),
    ]);

    return {
      data: tickets,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
    const existing = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Maintenance request not found');
    }

    const updateData: any = {};
    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.location) updateData.location = dto.location;
    if (dto.priority) updateData.priority = parseInt(dto.priority, 10);
    if (dto.status) updateData.status = dto.status;

    const updated = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: updateData,
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`Maintenance request updated: ${id}`);
    return updated;
  }

  async resolve(id: string, resolution: string) {
    const updated = await this.prisma.maintenanceRequest.update({
      where: { id },
      data: {
        status: TicketStatus.RESOLVED,
      },
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`Maintenance request resolved: ${id}`);
    return updated;
  }

  async delete(id: string) {
    await this.prisma.maintenanceRequest.delete({
      where: { id },
    });

    this.logger.log(`Maintenance request deleted: ${id}`);
    return { message: 'Maintenance request deleted successfully' };
  }
}
