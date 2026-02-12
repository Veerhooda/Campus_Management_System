import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user with roles
   */
  async create(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      roles,
      registrationNumber,
      departmentId,
      year,
      section,
      employeeId,
    } = createUserDto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Prepare profile data
    let studentProfileData = undefined;
    let teacherProfileData = undefined;

    if (roles.includes(Role.STUDENT)) {
      if (!departmentId || !year || !section || !registrationNumber) {
        throw new ConflictException(
          'Student requires department, year, section, and registration number',
        );
      }

      // Find class
      const studentClass = await this.prisma.class.findFirst({
        where: {
          departmentId,
          year: +year,
          section,
        },
      });

      if (!studentClass) {
        throw new NotFoundException('Class not found for the given details');
      }

      studentProfileData = {
        create: {
          rollNumber: registrationNumber.slice(-4), // Simple roll no generation
          registrationNumber,
          enrollmentYear: new Date().getFullYear(),
          classId: studentClass.id,
        },
      };
    }

    if (roles.includes(Role.TEACHER)) {
      if (!departmentId) {
        throw new ConflictException('Faculty requires a department');
      }
      teacherProfileData = {
        create: {
          employeeId: employeeId || `EMP${Date.now()}`,
          departmentId,
        },
      };
    }

    // Create user with roles in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone,
          roles: {
            create: roles.map((role) => ({ role })),
          },
          studentProfile: studentProfileData,
          teacherProfile: teacherProfileData,
          // Initialize empty profiles for others if needed
          adminProfile: roles.includes(Role.ADMIN) ? { create: {} } : undefined,
          organizerProfile: roles.includes(Role.ORGANIZER)
            ? { create: {} }
            : undefined,
        },
        include: {
          roles: { select: { role: true } },
          studentProfile: true,
          teacherProfile: true,
        },
      });

      return newUser;
    });

    this.logger.log(`User created: ${user.email}`);

    // Return user without password hash
    return this.sanitizeUser(user);
  }

  /**
   * Find all users (with pagination)
   */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          roles: { select: { role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users.map(this.sanitizeUser),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: { select: { role: true } },
        studentProfile: true,
        teacherProfile: true,
        adminProfile: true,
        organizerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        roles: { select: { role: true } },
      },
    });

    return user ? this.sanitizeUser(user) : null;
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const { roles, ...updateData } = updateUserDto;

    const user = await this.prisma.$transaction(async (tx) => {
      // Update basic user data
      const updatedUser = await tx.user.update({
        where: { id },
        data: updateData,
        include: {
          roles: { select: { role: true } },
        },
      });

      // Update roles if provided
      if (roles && roles.length > 0) {
        // Delete existing roles
        await tx.userRole.deleteMany({
          where: { userId: id },
        });

        // Create new roles
        await tx.userRole.createMany({
          data: roles.map((role) => ({ userId: id, role })),
        });

        // Refetch with updated roles
        return tx.user.findUnique({
          where: { id },
          include: {
            roles: { select: { role: true } },
          },
        });
      }

      return updatedUser;
    });

    this.logger.log(`User updated: ${id}`);

    return this.sanitizeUser(user!);
  }

  /**
   * Deactivate user (soft delete)
   */
  async deactivate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    this.logger.log(`User deactivated: ${id}`);

    return { message: 'User deactivated successfully' };
  }

  /**
   * Reactivate user
   */
  async reactivate(id: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    this.logger.log(`User reactivated: ${id}`);

    return { message: 'User reactivated successfully' };
  }

  /**
   * Delete user permanently
   */
  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted: ${id}`);

    return { message: 'User deleted successfully' };
  }

  /**
   * Get users by role
   */
  async findByRole(role: Role, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          roles: {
            some: { role },
          },
          isActive: true,
        },
        skip,
        take: limit,
        include: {
          roles: { select: { role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({
        where: {
          roles: {
            some: { role },
          },
          isActive: true,
        },
      }),
    ]);

    return {
      data: users.map(this.sanitizeUser),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Remove password hash from user object
   */
  private sanitizeUser(user: any) {
    if (!user) return null;
    
    const { passwordHash, ...rest } = user;
    return {
      ...rest,
      roles: user.roles?.map((r: { role: Role }) => r.role) || [],
    };
  }
}
