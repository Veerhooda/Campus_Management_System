import { IsNotEmpty, IsString, IsOptional, IsUUID, IsIn, IsArray } from 'class-validator';

// Valid notification types from Prisma schema
const NOTIFICATION_TYPES = ['EVENT', 'ATTENDANCE', 'GRIEVANCE', 'MAINTENANCE', 'ANNOUNCEMENT', 'SYSTEM'] as const;
type NotificationTypeValue = typeof NOTIFICATION_TYPES[number];

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsIn(NOTIFICATION_TYPES)
  @IsOptional()
  type?: NotificationTypeValue;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class BulkNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsIn(NOTIFICATION_TYPES)
  @IsOptional()
  type?: NotificationTypeValue;

  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}
