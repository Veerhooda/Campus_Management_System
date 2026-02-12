import { IsString, IsOptional, IsArray, IsHexColor } from 'class-validator';

export class CreateClubDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bgUrl?: string;

  @IsString()
  @IsOptional()
  @IsHexColor()
  themeColor?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  achievements?: string[];
}

export class UpdateClubDto extends CreateClubDto {}
