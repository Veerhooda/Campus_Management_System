import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../prisma';
import { UploadFileDto } from './dto';

@Injectable()
export class FilesService implements OnModuleInit {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client | null = null;
  private bucket: string = '';
  private readonly urlExpiration: number = 3600;
  private s3Enabled = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    // Initialize S3 client only if credentials are provided
    const accessKeyId = this.configService.get<string>('s3.accessKeyId');
    const secretAccessKey = this.configService.get<string>('s3.secretAccessKey');
    const bucket = this.configService.get<string>('s3.bucket');

    if (accessKeyId && secretAccessKey && bucket) {
      this.s3Client = new S3Client({
        endpoint: this.configService.get('s3.endpoint'),
        region: this.configService.get('s3.region') || 'us-east-1',
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true, // Required for MinIO
      });
      this.bucket = bucket;
      this.s3Enabled = true;
      this.logger.log('S3 storage initialized');
    } else {
      this.logger.warn('S3 storage not configured - file uploads will be disabled');
    }
  }

  private ensureS3Enabled() {
    if (!this.s3Enabled || !this.s3Client) {
      throw new BadRequestException('File storage is not configured');
    }
  }

  /**
   * Generate a presigned URL for uploading a file
   */
  async getUploadUrl(dto: UploadFileDto, uploadedById: string) {
    this.ensureS3Enabled();

    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: uploadedById },
    });

    if (!teacher) {
      throw new BadRequestException('Only teachers can upload files');
    }

    const key = `${uuid()}/${dto.filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client!, command, {
      expiresIn: this.urlExpiration,
    });

    const file = await this.prisma.file.create({
      data: {
        filename: dto.filename,
        originalName: dto.filename,
        mimeType: dto.mimeType,
        sizeBytes: dto.size,
        storageKey: key,
        uploadedById: teacher.id,
      },
    });

    this.logger.log(`Upload URL generated for file: ${file.id}`);

    return {
      fileId: file.id,
      uploadUrl,
      key,
      expiresIn: this.urlExpiration,
    };
  }

  /**
   * Generate a presigned URL for downloading a file
   */
  async getDownloadUrl(fileId: string) {
    this.ensureS3Enabled();

    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: file.storageKey,
    });

    const downloadUrl = await getSignedUrl(this.s3Client!, command, {
      expiresIn: this.urlExpiration,
    });

    return {
      fileId: file.id,
      filename: file.originalName,
      downloadUrl,
      expiresIn: this.urlExpiration,
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
        uploadedBy: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
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
          uploadedBy: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
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

    // Delete from S3 if enabled
    if (this.s3Enabled && this.s3Client) {
      try {
        await this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: file.storageKey,
          }),
        );
      } catch (error) {
        this.logger.warn(`Failed to delete S3 object: ${file.storageKey}`);
      }
    }

    // Delete metadata
    await this.prisma.file.delete({
      where: { id: fileId },
    });

    this.logger.log(`File deleted: ${fileId}`);
    return { message: 'File deleted successfully' };
  }
}
