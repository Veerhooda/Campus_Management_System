import { IsNotEmpty, IsString, IsUUID, IsEnum, Matches } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

export class CreateTimetableSlotDto {
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in HH:MM format' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in HH:MM format' })
  endTime: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;
}

export class UpdateTimetableSlotDto {
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in HH:MM format' })
  startTime?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in HH:MM format' })
  endTime?: string;

  @IsUUID()
  subjectId?: string;

  @IsUUID()
  teacherId?: string;

  @IsUUID()
  roomId?: string;
}
