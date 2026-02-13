import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateClubDto, UpdateClubDto } from './dto/club.dto';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async getMyClub(organizerUserId: string) {
    const organizer = await this.prisma.user.findUnique({
      where: { id: organizerUserId },
      include: { organizerProfile: { include: { club: { include: { members: true } } } } },
    });

    if (!organizer?.organizerProfile) {
      // Return null instead of 404 to avoid console errors
      return null;
    }

    return organizer.organizerProfile.club || null;
  }

  async updateClub(organizerUserId: string, data: UpdateClubDto) {
    const organizer = await this.prisma.user.findUnique({
      where: { id: organizerUserId },
      include: { organizerProfile: true },
    });

    let organizerProfile = organizer?.organizerProfile;

    if (!organizerProfile) {
      // Auto-create profile if missing (user is authenticated as ORGANIZER)
      organizerProfile = await this.prisma.organizer.create({
        data: { userId: organizerUserId },
      });
    }

    const club = await this.prisma.club.upsert({
      where: { organizerId: organizerProfile.id },
      update: {
        ...data,
      },
      create: {
        ...data,
        organizerId: organizerProfile.id,
      },
    });

    return club;
  }

  async addMember(organizerUserId: string, studentEmail: string) {
    const club = await this.getMyClub(organizerUserId);
    if (!club) {
      throw new BadRequestException('Please set up your club profile first');
    }

    const studentUser = await this.prisma.user.findUnique({
      where: { email: studentEmail },
      include: { studentProfile: true },
    });

    if (!studentUser?.studentProfile) {
      throw new NotFoundException('Student not found with this email');
    }

    // Check if already member
    const existing = await this.prisma.clubMember.findUnique({
      where: {
        clubId_studentId: {
          clubId: club.id,
          studentId: studentUser.studentProfile.id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Student is already a member');
    }

    return this.prisma.clubMember.create({
      data: {
        clubId: club.id,
        studentId: studentUser.studentProfile.id,
      },
      include: { student: { include: { user: true } } },
    });
  }

  async getMembers(organizerUserId: string) {
    const club = await this.getMyClub(organizerUserId);
    if (!club) return [];

    return this.prisma.clubMember.findMany({
      where: { clubId: club.id },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
          },
        },
      },
    });
  }

  // --- ADMIN METHODS ---
  async findAll() {
    return this.prisma.club.findMany({
      include: {
        organizer: {
          include: { user: true },
        },
      },
    });
  }

  async create(data: CreateClubDto) {
    return this.prisma.club.create({
      data: {
         name: data.name,
         description: data.description,
         // Note: organizerId is not here, admin will assign later
      },
    });
  }

  async assignOrganizer(clubId: string, organizerEmail: string) {
    const organizerUser = await this.prisma.user.findUnique({
      where: { email: organizerEmail },
      include: { organizerProfile: true },
    });

    if (!organizerUser?.organizerProfile) {
      throw new NotFoundException('Organizer not found');
    }

    // Check if organizer already has a club (if we enforce 1:1 strictly)
    // Actually, prisma `unique` on organizerId handles this, but let's check gracefully
    const existingClub = await this.prisma.club.findUnique({
      where: { organizerId: organizerUser.organizerProfile.id },
    });

    if (existingClub) {
      throw new BadRequestException('This organizer already manages a club');
    }

    return this.prisma.club.update({
      where: { id: clubId },
      data: {
        organizerId: organizerUser.organizerProfile.id,
      },
      include: { organizer: { include: { user: true } } },
    });
  }
}
