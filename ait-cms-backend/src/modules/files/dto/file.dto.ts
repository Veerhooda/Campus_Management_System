import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsInt()
  @Min(1)
  size: number;

  @IsString()
  @IsOptional()
  category?: string;
}

export class GetPresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;
}
