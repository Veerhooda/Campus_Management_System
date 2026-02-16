import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { CreateChannelDto, SendMessageDto, AddChannelMemberDto } from './dto/channel.dto';

@Controller('channels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  // === ORGANIZER ENDPOINTS ===

  @Post()
  @Roles(Role.ORGANIZER)
  async createChannel(@CurrentUser() user: User, @Body() dto: CreateChannelDto) {
    return this.channelsService.createChannel(user.id, dto.name, dto.description);
  }

  @Get('club')
  @Roles(Role.ORGANIZER)
  async getClubChannels(@CurrentUser() user: User) {
    return this.channelsService.getClubChannels(user.id);
  }

  @Post(':id/members')
  @Roles(Role.ORGANIZER)
  async addMember(
    @CurrentUser() user: User,
    @Param('id') channelId: string,
    @Body() dto: AddChannelMemberDto,
  ) {
    return this.channelsService.addChannelMember(user.id, channelId, dto.studentId);
  }

  @Delete(':id/members/:memberId')
  @Roles(Role.ORGANIZER)
  async removeMember(
    @CurrentUser() user: User,
    @Param('id') channelId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.channelsService.removeChannelMember(user.id, channelId, memberId);
  }

  @Delete(':id')
  @Roles(Role.ORGANIZER)
  async deleteChannel(@CurrentUser() user: User, @Param('id') channelId: string) {
    return this.channelsService.deleteChannel(user.id, channelId);
  }

  // === STUDENT ENDPOINTS ===

  @Get('my-channels')
  @Roles(Role.STUDENT, Role.ORGANIZER)
  async getMyChannels(@CurrentUser() user: User) {
    return this.channelsService.getMyChannels(user.id);
  }

  // === SHARED ENDPOINTS (Student + Organizer) ===

  @Get(':id/messages')
  @Roles(Role.STUDENT, Role.ORGANIZER)
  async getMessages(
    @CurrentUser() user: User,
    @Param('id') channelId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.channelsService.getMessages(user.id, channelId, page, limit);
  }

  @Post(':id/messages')
  @Roles(Role.STUDENT, Role.ORGANIZER)
  async sendMessage(
    @CurrentUser() user: User,
    @Param('id') channelId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.channelsService.sendMessage(user.id, channelId, dto.content);
  }
}
