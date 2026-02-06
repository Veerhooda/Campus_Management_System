import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;
}

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  venue?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
