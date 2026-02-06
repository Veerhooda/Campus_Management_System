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
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * POST /api/v1/files/upload
   * Get presigned URL for uploading a file (Teacher only)
   */
  @Post('upload')
  @Roles(Role.TEACHER)
  async getUploadUrl(
    @Body() dto: UploadFileDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.filesService.getUploadUrl(dto, userId);
  }

  /**
   * GET /api/v1/files/:id/download
   * Get presigned URL for downloading a file
   */
  @Get(':id/download')
  async getDownloadUrl(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.getDownloadUrl(id);
  }

  /**
   * GET /api/v1/files/my
   * Get my uploaded files (Teacher only)
   */
  @Get('my')
  @Roles(Role.TEACHER)
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
