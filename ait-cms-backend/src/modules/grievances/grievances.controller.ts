import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Role, TicketStatus } from '@prisma/client';
import { GrievancesService } from './grievances.service';
import { CreateGrievanceDto, UpdateGrievanceDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  @Post()
  async create(
    @Body() dto: CreateGrievanceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.grievancesService.create(dto, userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: TicketStatus,
  ) {
    return this.grievancesService.findAll(page, limit, status);
  }

  @Get('my')
  async findMyGrievances(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.grievancesService.findMyGrievances(userId, page, limit);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('roles') roles: Role[],
  ) {
    return this.grievancesService.findById(id, userId, roles);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGrievanceDto,
  ) {
    return this.grievancesService.update(id, dto);
  }

  @Post(':id/assign/:adminId')
  @Roles(Role.ADMIN)
  async assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('adminId', ParseUUIDPipe) adminId: string,
  ) {
    return this.grievancesService.assign(id, adminId);
  }

  @Post(':id/resolve')
  @Roles(Role.ADMIN)
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('resolution') resolution: string,
  ) {
    return this.grievancesService.resolve(id, resolution);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.grievancesService.delete(id);
  }
}
