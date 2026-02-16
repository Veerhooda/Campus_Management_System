import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class AddChannelMemberDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
