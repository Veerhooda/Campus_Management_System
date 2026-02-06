import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class CreateMaintenanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  priority?: string;
}

export class UpdateMaintenanceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsString()
  @IsOptional()
  resolution?: string;
}
