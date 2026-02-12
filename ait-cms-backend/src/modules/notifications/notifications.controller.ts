import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, BulkNotificationDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * POST /api/v1/notifications
   * Create notification (Admin only)
   */
  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto);
  }

  /**
   * POST /api/v1/notifications/bulk
   * Create bulk notifications (Admin only)
   */
  @Post('bulk')
  @Roles(Role.ADMIN, Role.TEACHER)
  async createBulk(@Body() dto: BulkNotificationDto) {
    return this.notificationsService.createBulk(dto);
  }

  /**
   * GET /api/v1/notifications
   * Get my notifications
   */
  @Get()
  async getMyNotifications(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('unreadOnly', new DefaultValuePipe(false), ParseBoolPipe) unreadOnly: boolean,
  ) {
    return this.notificationsService.getMyNotifications(userId, page, limit, unreadOnly);
  }

  /**
   * GET /api/v1/notifications/unread-count
   * Get unread count
   */
  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * POST /api/v1/notifications/:id/read
   * Mark notification as read
   */
  @Post(':id/read')
  async markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }

  /**
   * POST /api/v1/notifications/read-all
   * Mark all notifications as read
   */
  @Post('read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * DELETE /api/v1/notifications/:id
   * Delete a notification
   */
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.delete(id, userId);
  }

  /**
   * DELETE /api/v1/notifications/read
   * Delete all read notifications
   */
  @Delete('read')
  async deleteAllRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.deleteAllRead(userId);
  }
}
