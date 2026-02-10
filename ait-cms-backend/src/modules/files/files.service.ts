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
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: uploadedByUserId },
    });

    if (!teacher) {
      throw new BadRequestException('Only teachers can upload files');
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
  async getAllFiles(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
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
      this.prisma.file.count(),
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
