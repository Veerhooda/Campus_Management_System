import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get the club for this organizer
   */
  private async getOrganizerClub(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
      include: { club: true },
    });

    if (!organizer?.club) {
      throw new BadRequestException('No club found for this organizer');
    }

    return organizer.club;
  }

  /**
   * Create a channel in the organizer's club
   */
  async createChannel(userId: string, name: string, description?: string) {
    const club = await this.getOrganizerClub(userId);

    return this.prisma.channel.create({
      data: {
        name,
        description,
        clubId: club.id,
      },
      include: {
        _count: { select: { members: true, messages: true } },
      },
    });
  }

  /**
   * Get all channels for the organizer's club
   */
  async getClubChannels(userId: string) {
    const club = await this.getOrganizerClub(userId);

    return this.prisma.channel.findMany({
      where: { clubId: club.id },
      include: {
        _count: { select: { members: true, messages: true } },
        members: {
          include: {
            student: {
              include: {
                user: { select: { firstName: true, lastName: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Add a club member to a channel
   */
  async addChannelMember(userId: string, channelId: string, studentId: string) {
    const club = await this.getOrganizerClub(userId);

    // Verify channel belongs to this club
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, clubId: club.id },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    // Verify student is a club member
    const clubMember = await this.prisma.clubMember.findFirst({
      where: { clubId: club.id, studentId },
    });
    if (!clubMember) throw new BadRequestException('Student is not a club member');

    // Check if already in channel
    const existing = await this.prisma.channelMember.findUnique({
      where: { channelId_studentId: { channelId, studentId } },
    });
    if (existing) throw new BadRequestException('Already in this channel');

    return this.prisma.channelMember.create({
      data: { channelId, studentId },
      include: {
        student: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    });
  }

  /**
   * Remove a member from a channel
   */
  async removeChannelMember(userId: string, channelId: string, memberId: string) {
    const club = await this.getOrganizerClub(userId);

    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, clubId: club.id },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    await this.prisma.channelMember.delete({ where: { id: memberId } });
    return { message: 'Removed from channel' };
  }

  /**
   * Delete a channel
   */
  async deleteChannel(userId: string, channelId: string) {
    const club = await this.getOrganizerClub(userId);

    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, clubId: club.id },
    });
    if (!channel) throw new NotFoundException('Channel not found');

    await this.prisma.channel.delete({ where: { id: channelId } });
    return { message: 'Channel deleted' };
  }

  /**
   * Get channels a student belongs to
   */
  async getMyChannels(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) return [];

    return this.prisma.channelMember.findMany({
      where: { studentId: student.id },
      include: {
        channel: {
          include: {
            club: { select: { id: true, name: true, logoUrl: true, themeColor: true } },
            _count: { select: { members: true, messages: true } },
          },
        },
      },
    });
  }

  /**
   * Get messages for a channel (with access check)
   */
  async getMessages(userId: string, channelId: string, page = 1, limit = 50) {
    // Check access: user must be organizer of the club OR a student member of the channel
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        club: { include: { organizer: true } },
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const isOrganizer = channel.club?.organizer?.userId === userId;

    if (!isOrganizer) {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new ForbiddenException('Access denied');
      
      const isMember = await this.prisma.channelMember.findUnique({
        where: { channelId_studentId: { channelId, studentId: student.id } },
      });
      if (!isMember) throw new ForbiddenException('You are not a member of this channel');
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.channelMessage.findMany({
        where: { channelId },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.channelMessage.count({ where: { channelId } }),
    ]);

    return {
      data: messages.reverse(), // oldest first within page
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Send a message to a channel (with access check)
   */
  async sendMessage(userId: string, channelId: string, content: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        club: { include: { organizer: true } },
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    const isOrganizer = channel.club?.organizer?.userId === userId;

    if (!isOrganizer) {
      const student = await this.prisma.student.findUnique({ where: { userId } });
      if (!student) throw new ForbiddenException('Access denied');
      
      const isMember = await this.prisma.channelMember.findUnique({
        where: { channelId_studentId: { channelId, studentId: student.id } },
      });
      if (!isMember) throw new ForbiddenException('You are not a member of this channel');
    }

    return this.prisma.channelMessage.create({
      data: {
        content,
        channelId,
        senderId: userId,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }
}
