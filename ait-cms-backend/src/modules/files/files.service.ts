import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../prisma';
import { User } from '@prisma/client';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    // Use local disk storage
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    this.logger.log(`Local file storage initialized at: ${this.uploadDir}`);
  }

  /**
   * Upload a file to local disk
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadedByUserId: string,
    subjectId?: string,
  ) {
    let teacher = await this.prisma.teacher.findUnique({
      where: { userId: uploadedByUserId },
    });

    // If not a teacher (e.g. Admin/Organizer), create a teacher profile for them to allow upload
    // This is a workaround since File model requires uploadedById to be a Teacher ID
    if (!teacher) {
      this.logger.log(`Creating auto-teacher profile for user ${uploadedByUserId} to allow file upload`);
      
      // Get a default department (e.g., General or first available)
      const department = await this.prisma.department.findFirst();
      if (!department) {
        throw new BadRequestException('Cannot upload: No departments found to link profile');
      }

      teacher = await this.prisma.teacher.create({
        data: {
          userId: uploadedByUserId,
          employeeId: `AUTO-${uuid().substring(0, 8).toUpperCase()}`,
          departmentId: department.id,
        },
      });
    }

    // Validate subject if provided
    if (subjectId) {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
      });
      if (!subject) {
        throw new BadRequestException('Subject not found');
      }
    }

    const fileId = uuid();
    const ext = path.extname(file.originalname);
    const storedFilename = `${fileId}${ext}`;
    const filePath = path.join(this.uploadDir, storedFilename);

    // Write file to disk
    fs.writeFileSync(filePath, file.buffer);

    const record = await this.prisma.file.create({
      data: {
        filename: storedFilename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageKey: storedFilename,
        uploadedById: teacher.id,
        subjectId: subjectId || null,
      },
      include: {
        uploadedBy: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        subject: true,
      },
    });

    this.logger.log(`File uploaded: ${record.id} (${file.originalname})`);
    return record;
  }

  /**
   * Get file path for download
   */
  async getFilePath(fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.join(this.uploadDir, file.storageKey);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return {
      filePath,
      filename: file.originalName,
      mimeType: file.mimeType,
    };
  }

  /**
   * Get all files uploaded by a teacher
   */
  async getMyFiles(userId: string, page = 1, limit = 20) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      // If no teacher profile, they haven't uploaded anything yet
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: { uploadedById: teacher.id },
        skip,
        take: limit,
        include: {
          subject: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.file.count({ where: { uploadedById: teacher.id } }),
    ]);

    return {
      data: files,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get file metadata by ID
   */
  async getFileById(fileId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploadedBy: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        subject: true,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  /**
   * Get files by subject
   */
  async getFilesBySubject(subjectId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: { subjectId },
        skip,
        take: limit,
        include: {
          uploadedBy: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.file.count({ where: { subjectId } }),
    ]);

    return {
      data: files,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get all files (for students to browse)
   */
  /**
   * Get all files (segregated by department for students)
   */
  async getAllFiles(user: any, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    // Check if user is a student
    const isStudent = user.roles && user.roles.some((r: any) => r.role === 'STUDENT');
    let subjectFilter: any = {};

    if (isStudent) {
      // Fetch student's department via class
      const student = await this.prisma.student.findUnique({
        where: { userId: user.id },
        include: { class: true },
      });

      if (student && student.class) {
        // Filter: Files linked to subjects in Student's Dept OR Files with NO subject (general)
        // AND Files linked to *NO* subject (if we want general files to be visible to all)
        // Logic: (subject.departmentId == student.deptId) OR (subjectId is null)
        subjectFilter = {
          OR: [
            { subject: { departmentId: student.class.departmentId } },
            { subjectId: null },
          ],
        };
      }
    }

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: subjectFilter,
        skip,
        take: limit,
        include: {
          uploadedBy: {
            include: {
              user: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
          subject: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.file.count({ where: subjectFilter }),
    ]);

    return {
      data: files,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, userId: string, isAdmin: boolean) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: { uploadedBy: true },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!isAdmin && file.uploadedBy.userId !== userId) {
      throw new BadRequestException('You can only delete your own files');
    }

    // Delete from disk
    const filePath = path.join(this.uploadDir, file.storageKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete metadata
    await this.prisma.file.delete({
      where: { id: fileId },
    });

    this.logger.log(`File deleted: ${fileId}`);
    return { message: 'File deleted successfully' };
  }
}
