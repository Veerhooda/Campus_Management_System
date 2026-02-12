import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { EventStatus } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateEventDto, UpdateEventDto } from './dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto, organizerId: string) {
    const startDateTime = new Date(dto.startDate);
    const endDateTime = new Date(dto.endDate);

    if (startDateTime >= endDateTime) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (startDateTime < new Date()) {
      throw new BadRequestException('Cannot create event in the past');
    }

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description || '',
        startDateTime,
        endDateTime,
        maxCapacity: dto.maxParticipants,
        roomId: dto.roomId,
        posterUrl: dto.posterUrl,
        themeColor: dto.themeColor,
        isFeedbackEnabled: dto.isFeedbackEnabled ?? false,
        organizerId,
      },
      include: {
        organizer: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
        _count: { select: { registrations: true } },
      },
    });

    this.logger.log(`Event created: ${event.id}`);
    return event;
  }

  async findAll(page = 1, limit = 20, status?: EventStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          organizer: { include: { user: { select: { firstName: true, lastName: true } } } },
          room: true,
          _count: { select: { registrations: true } },
        },
        orderBy: { startDateTime: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findUpcoming(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = {
      startDateTime: { gte: new Date() },
      status: EventStatus.PUBLISHED,
    };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          organizer: { include: { user: { select: { firstName: true, lastName: true } } } },
          room: true,
          _count: { select: { registrations: true } },
        },
        orderBy: { startDateTime: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        room: true,
        registrations: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
          take: 50,
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const existing = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Event not found');
    }

    const updateData: any = { ...dto };
    if (dto.startDate) updateData.startDateTime = new Date(dto.startDate);
    if (dto.endDate) updateData.endDateTime = new Date(dto.endDate);
    if (dto.maxParticipants !== undefined) updateData.maxCapacity = dto.maxParticipants;
    
    // Remove DTO-specific fields that don't match schema
    delete updateData.startDate;
    delete updateData.endDate;
    delete updateData.maxParticipants;
    // These are valid schema fields, no need to delete if they exist in DTO and schema match
    // posterUrl, themeColor, isFeedbackEnabled map directly

    const updated = await this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: { include: { user: { select: { firstName: true, lastName: true } } } },
        room: true,
        _count: { select: { registrations: true } },
      },
    });

    this.logger.log(`Event updated: ${id}`);
    return updated;
  }

  async publish(id: string) {
    return this.update(id, { status: EventStatus.PUBLISHED });
  }

  async cancel(id: string) {
    return this.update(id, { status: EventStatus.CANCELLED });
  }

  async register(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not open for registration');
    }

    if (event.maxCapacity && event._count.registrations >= event.maxCapacity) {
      throw new BadRequestException('Event is full');
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { eventId, userId },
      },
    });

    if (existing) {
      throw new ConflictException('Already registered for this event');
    }

    const registration = await this.prisma.eventRegistration.create({
      data: { eventId, userId },
      include: {
        event: { select: { title: true, startDateTime: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    this.logger.log(`User ${userId} registered for event ${eventId}`);
    return registration;
  }

  async unregister(eventId: string, userId: string) {
    await this.prisma.eventRegistration.delete({
      where: {
        userId_eventId: { eventId, userId },
      },
    });

    this.logger.log(`User ${userId} unregistered from event ${eventId}`);
    return { message: 'Successfully unregistered from event' };
  }

  async getMyEvents(userId: string) {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: { include: { user: { select: { firstName: true, lastName: true } } } },
            room: true,
          },
        },
      },
      orderBy: { event: { startDateTime: 'asc' } },
    });

    return registrations.map((r) => r.event);
  }

  async delete(id: string) {
    await this.prisma.event.delete({
      where: { id },
    });

    this.logger.log(`Event deleted: ${id}`);
    return { message: 'Event deleted successfully' };
  }

  async getMyRegistrations(userId: string) {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            room: true,
          },
        },
      },
      orderBy: { event: { startDateTime: 'asc' } },
    });

    return registrations.map(r => ({
      ...r.event,
      attended: r.attended,
      registrationId: r.id,
    }));
  }

  async submitFeedback(eventId: string, userId: string, dto: any) {
    const studentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { studentProfile: true },
    });

    if (!studentUser?.studentProfile) {
      throw new BadRequestException('Only students can submit feedback');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true },
    });

    if (!event) throw new NotFoundException('Event not found');

    if (!event.isFeedbackEnabled) {
      throw new BadRequestException('Feedback is not enabled for this event');
    }

    // Check if attended
    const registration = event.registrations.find(r => r.userId === userId);
    
    // Strict check 'attended' flag.
    if (!registration?.attended) {
      throw new BadRequestException('You must have attended the event to submit feedback');
    }

    // Check if already submitted
    const existing = await this.prisma.eventFeedback.findUnique({
      where: {
        eventId_studentId: {
          eventId,
          studentId: studentUser.studentProfile.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Feedback already submitted');
    }

    return this.prisma.eventFeedback.create({
      data: {
        eventId,
        studentId: studentUser.studentProfile.id,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async getFeedback(eventId: string) {
    const feedback = await this.prisma.eventFeedback.findMany({
      where: { eventId },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / (feedback.length || 1);

    return {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: feedback.length,
      reviews: feedback,
    };
  }

  async markAttendance(eventId: string, userId: string) {
    // This method is for organizer to mark a student as attended
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    
    if (!registration) throw new NotFoundException('User not registered');
    
    return this.prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { attended: true }
    });
  }
}
