import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { PrismaModule } from './prisma';
import { AuthModule, JwtAuthGuard } from './modules/auth';
import { UsersModule } from './modules/users';
import { StudentsModule } from './modules/students';
import { TeachersModule } from './modules/teachers';
import { TimetableModule } from './modules/timetable';
import { AttendanceModule } from './modules/attendance';
import { EventsModule } from './modules/events';
import { GrievancesModule } from './modules/grievances';
import { MaintenanceModule } from './modules/maintenance';
import { FilesModule } from './modules/files';
import { NotificationsModule } from './modules/notifications';
import { RolesGuard } from './common/guards';
import { ClubsModule } from './modules/clubs/clubs.module';
import { CounsellingModule } from './modules/counselling/counselling.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 100, // 100 requests per TTL
    }]),

    // Redis / Bull queue
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    TimetableModule,
    AttendanceModule,
    EventsModule,
    GrievancesModule,
    MaintenanceModule,
    FilesModule,
    NotificationsModule,
    ClubsModule,
    CounsellingModule,
  ],
  controllers: [],
  providers: [
    // Global guards - order matters!
    // ThrottlerGuard -> JwtAuthGuard -> RolesGuard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
