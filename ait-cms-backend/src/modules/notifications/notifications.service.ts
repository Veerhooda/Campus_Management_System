import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateNotificationDto, BulkNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a notification for a single user
   */
  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        title: dto.title,
        message: dto.message,
        type: dto.type || NotificationType.ANNOUNCEMENT,
        userId: dto.userId,
      },
    });

    this.logger.log(`Notification created for user: ${dto.userId}`);
    return notification;
  }

  /**
   * Create notifications for multiple users
   */
  async createBulk(dto: BulkNotificationDto) {
    const notifications = await this.prisma.notification.createMany({
      data: dto.userIds.map((userId) => ({
        title: dto.title,
        message: dto.message,
        type: dto.type || NotificationType.ANNOUNCEMENT,
        userId,
      })),
    });

    this.logger.log(`Bulk notifications created for ${dto.userIds.length} users`);
    return { count: notifications.count };
  }

  /**
   * Get notifications for a user
   */
  async getMyNotifications(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), unreadCount },
    };
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return updated;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  /**
   * Delete a notification
   */
  async delete(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return { message: 'Notification deleted successfully' };
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });

    return { count: result.count };
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { unreadCount: count };
  }
}
