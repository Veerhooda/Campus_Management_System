import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class CreateGrievanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateGrievanceDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsString()
  @IsOptional()
  resolution?: string;
}
