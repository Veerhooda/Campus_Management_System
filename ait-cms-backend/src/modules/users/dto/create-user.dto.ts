import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsEnum(Role, { each: true, message: 'Invalid role' })
  @IsNotEmpty({ message: 'At least one role is required' })
  roles: Role[];
}
