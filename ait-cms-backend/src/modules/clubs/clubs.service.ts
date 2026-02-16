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
      organizerProfile = await this.prisma.organizer.create({
        data: { userId: organizerUserId },
      });
    }

    const club = await this.prisma.club.upsert({
      where: { organizerId: organizerProfile.id },
      update: { ...data },
      create: { ...data, organizerId: organizerProfile.id },
    });

    return club;
  }

  /**
   * Add a student to the organizer's club by email
   * Fixed: directly query the club via organizer profile to avoid response wrapping issues
   */
  async addMember(organizerUserId: string, studentEmail: string) {
    // Directly resolve the club via the organizer profile
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId: organizerUserId },
      include: { club: true },
    });

    if (!organizer) {
      throw new BadRequestException('Organizer profile not found. Please contact admin.');
    }

    if (!organizer.club) {
      throw new BadRequestException('Please set up your club profile first');
    }

    const clubId = organizer.club.id;

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
          clubId,
          studentId: studentUser.studentProfile.id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Student is already a member');
    }

    return this.prisma.clubMember.create({
      data: {
        clubId,
        studentId: studentUser.studentProfile.id,
      },
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

  /**
   * Remove a member from the club
   */
  async removeMember(organizerUserId: string, memberId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId: organizerUserId },
      include: { club: true },
    });

    if (!organizer?.club) {
      throw new BadRequestException('Club not found');
    }

    const member = await this.prisma.clubMember.findFirst({
      where: { id: memberId, clubId: organizer.club.id },
    });

    if (!member) {
      throw new NotFoundException('Member not found in your club');
    }

    await this.prisma.clubMember.delete({ where: { id: memberId } });
    return { message: 'Member removed successfully' };
  }

  /**
   * Search students by name or email (for member add autocomplete)
   */
  async searchStudents(query: string) {
    if (!query || query.length < 2) return [];

    return this.prisma.user.findMany({
      where: {
        AND: [
          { roles: { some: { role: 'STUDENT' } } },
          { isActive: true },
          {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        studentProfile: {
          select: {
            rollNumber: true,
            registrationNumber: true,
            class: { select: { name: true } },
          },
        },
      },
      take: 10,
    });
  }

  async getMembers(organizerUserId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId: organizerUserId },
      include: { club: true },
    });

    if (!organizer?.club) return [];

    return this.prisma.clubMember.findMany({
      where: { clubId: organizer.club.id },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
            class: { select: { name: true } },
          },
        },
      },
    });
  }

  /**
   * Get clubs a student belongs to (for student dashboard)
   */
  async getStudentClubs(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) return [];

    return this.prisma.clubMember.findMany({
      where: { studentId: student.id },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            description: true,
            logoUrl: true,
            themeColor: true,
            organizer: {
              include: {
                user: { select: { firstName: true, lastName: true } },
              },
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
        _count: { select: { members: true, channels: true } },
      },
    });
  }

  async create(data: CreateClubDto) {
    return this.prisma.club.create({
      data: {
         name: data.name,
         description: data.description,
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
