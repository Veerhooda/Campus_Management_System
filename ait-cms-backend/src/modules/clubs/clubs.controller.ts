import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { CreateClubDto, UpdateClubDto } from './dto/club.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get('my-club')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async getMyClub(@CurrentUser() user: User) {
    return this.clubsService.getMyClub(user.id);
  }

  @Put('my-club')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async updateClub(@CurrentUser() user: User, @Body() data: UpdateClubDto) {
    return this.clubsService.updateClub(user.id, data);
  }

  @Post('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async addMember(@CurrentUser() user: User, @Body() dto: AddMemberDto) {
    return this.clubsService.addMember(user.id, dto.email);
  }

  @Get('members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER)
  async getMembers(@CurrentUser() user: User) {
    return this.clubsService.getMembers(user.id);
  }

  // --- ADMIN ENDPOINTS ---

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllClubs() {
    return this.clubsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createClub(@Body() dto: CreateClubDto) {
    return this.clubsService.create(dto);
  }

  @Put(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async assignOrganizer(@Param('id') id: string, @Body() body: { email: string }) {
    return this.clubsService.assignOrganizer(id, body.email);
  }
}
