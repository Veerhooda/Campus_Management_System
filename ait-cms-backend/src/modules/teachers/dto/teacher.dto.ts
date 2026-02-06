import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTeacherProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'Employee ID is required' })
  employeeId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Department ID is required' })
  departmentId: string;
}

export class UpdateTeacherProfileDto {
  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
