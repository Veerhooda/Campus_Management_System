
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsNotEmpty()
  notes: string;

  @IsString()
  @IsOptional()
  actionItems?: string;
}
