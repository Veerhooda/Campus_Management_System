import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Res,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import { FilesService } from './files.service';
import { Roles, CurrentUser, Public } from '../../common/decorators';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * POST /api/v1/files/upload
   * Upload a file (Teacher only)
   */
  @Post('upload')
  @Roles(Role.TEACHER, Role.ORGANIZER, Role.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
    @Query('subjectId') subjectId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.filesService.uploadFile(file, userId, subjectId);
  }

  /**
   * GET /api/v1/files/:id/download
   * Download a file
   */
  @Public()
  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const { filePath, filename, mimeType } =
      await this.filesService.getFilePath(id);
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(filename)}"`,
    );
    res.sendFile(filePath);
  }

  /**
   * GET /api/v1/files/my
   * Get my uploaded files (Teacher only)
   */
  @Get('my')
  @Roles(Role.TEACHER, Role.ORGANIZER, Role.ADMIN)
  async getMyFiles(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.filesService.getMyFiles(userId, page, limit);
  }

  /**
   * GET /api/v1/files/subject/:subjectId
   * Get files by subject
   */
  @Get('subject/:subjectId')
  async getBySubject(
    @Param('subjectId', ParseUUIDPipe) subjectId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.filesService.getFilesBySubject(subjectId, page, limit);
  }

  /**
   * GET /api/v1/files/all
   * Get all files (for students to browse)
   */
  @Get('all')
  async getAllFiles(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.filesService.getAllFiles(user, page, limit);
  }

  /**
   * GET /api/v1/files/:id
   * Get file metadata
   */
  @Get(':id')
  async getFileById(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.getFileById(id);
  }

  /**
   * DELETE /api/v1/files/:id
   * Delete a file
   */
  @Delete(':id')
  async deleteFile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') roles: Role[],
  ) {
    return this.filesService.deleteFile(id, userId, roles.includes(Role.ADMIN));
  }
}
