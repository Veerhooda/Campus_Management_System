import { IsNotEmpty, IsString, IsInt, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateStudentProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Roll number is required' })
  rollNumber: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  enrollmentYear: number;

  @IsUUID()
  @IsNotEmpty({ message: 'Class ID is required' })
  classId: string;
}

export class UpdateStudentProfileDto {
  @IsString()
  @IsOptional()
  rollNumber?: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  enrollmentYear?: number;

  @IsUUID()
  @IsOptional()
  classId?: string;
}
