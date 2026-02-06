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
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto, UpdateMaintenanceDto } from './dto';
import { Roles, CurrentUser } from '../../common/decorators';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  async create(
    @Body() dto: CreateMaintenanceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.maintenanceService.create(dto, userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: TicketStatus,
  ) {
    return this.maintenanceService.findAll(page, limit, status);
  }

  @Get('my')
  async findMyTickets(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.maintenanceService.findMyTickets(userId, page, limit);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.maintenanceService.update(id, dto);
  }

  @Post(':id/resolve')
  @Roles(Role.ADMIN)
  async resolve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('resolution') resolution: string,
  ) {
    return this.maintenanceService.resolve(id, resolution);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.maintenanceService.delete(id);
  }
}
