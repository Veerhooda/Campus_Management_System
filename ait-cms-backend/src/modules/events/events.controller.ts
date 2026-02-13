import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Role, EventStatus } from '@prisma/client';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto, CreateEventFeedbackDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';
import { PrismaService } from '../../prisma';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    // Get organizer profile
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
    });
    if (!organizer) throw new Error('Organizer profile not found');
    return this.eventsService.create(dto, organizer.id);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: EventStatus,
  ) {
    return this.eventsService.findAll(page, limit, status);
  }

  @Get('upcoming')
  async findUpcoming(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.eventsService.findUpcoming(page, limit);
  }

  @Get('my-events')
  async getMyEvents(@CurrentUser('id') userId: string) {
    return this.eventsService.getMyEvents(userId);
  }

  @Get('my-registrations')
  @Roles(Role.STUDENT)
  async getMyRegistrations(@CurrentUser('id') userId: string) {
    return this.eventsService.getMyRegistrations(userId);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, dto);
  }

  @Post(':id/publish')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.publish(id);
  }

  @Post(':id/cancel')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.cancel(id);
  }

  @Post(':id/register')
  @Roles(Role.STUDENT)
  async register(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.register(id, userId);
  }

  @Delete(':id/register')
  @Roles(Role.STUDENT)
  async unregister(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.eventsService.unregister(id, userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.delete(id);
  }

  @Post(':id/feedback')
  @Roles(Role.STUDENT)
  async submitFeedback(
    @Param('id', ParseUUIDPipe) eventId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEventFeedbackDto,
  ) {
    return this.eventsService.submitFeedback(eventId, userId, dto);
  }

  @Get(':id/feedback')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async getFeedback(@Param('id', ParseUUIDPipe) eventId: string) {
    return this.eventsService.getFeedback(eventId);
  }

  @Post(':id/attendance/:userId')
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async markAttendance(
    @Param('id', ParseUUIDPipe) eventId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.eventsService.markAttendance(eventId, userId);
  }
}
