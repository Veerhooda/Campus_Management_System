import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MarkAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsBoolean()
  present: boolean;
}

export class BulkAttendanceDto {
  @IsUUID()
  @IsNotEmpty()
  timetableSlotId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceDto)
  attendance: MarkAttendanceDto[];
}

export class GetAttendanceQueryDto {
  @IsUUID()
  @IsOptional()
  studentId?: string;

  @IsUUID()
  @IsOptional()
  classId?: string;

  @IsUUID()
  @IsOptional()
  subjectId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
