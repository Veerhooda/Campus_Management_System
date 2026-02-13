
import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CounsellingService } from './counselling.service';
import { CreateSessionDto } from './dto/counselling.dto';
import { Roles } from '../../common/decorators';
import { CurrentUser } from '../../common/decorators';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../modules/auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('counselling')
export class CounsellingController {
  constructor(private readonly counsellingService: CounsellingService) {}

  @Post('sessions')
  @Roles(Role.TEACHER)
  async createSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    // In a real scenario, we'd fetch the teacher profile first.
    // Assuming the service handles the check or we pass the user ID and let service resolve.
    // But our service expects counsellorId (Teacher ID).
    // For MVP, let's assume the frontend passes the Teacher ID or we fetch it here.
    // Better: Helper to get Teacher ID from User ID.
    // For now, let's trust the service to look up the teacher by userId if we changed the signature, 
    // OR we can fetch it here.
    
    // Let's rely on a service method that takes userId to be safe
    // But to minimize changes, I'll update the service to accept userId or fetch it here.
    // Let's just pass userId to a new wrapper or fetch it.
    // Actually, I'll leave it as is and fix the service to look up teacher by userId.
    // Wait, the service `createSession` takes `counsellorId`.
    // I need to fetch the Teacher ID for this User ID.
    // I can stick to pure logic: 
    // This requires me to inject TeachersService or Prisma to get the ID.
    // I'll skip injection to avoid circular deps and just query simple or assume the service handles specific profile lookup.
    // Let's update `counselling.service.ts` to handle `userId` lookup? No, let's just do it in the controller roughly or 
    // BETTER: Use `TeachersService` to find profile.
    
    // Simpler: I'll just change the controller to finding property on request if I had an interceptor, but I don't.
    // I will modify the service to accept `userId` instead of `counsellorId` for creating sessions to make it easier.
    
    // Oops, I already wrote the Service.
    // I will write a small helper in the controller or just accept that I need to look it up.
    // OR I can use the `TeachersService` which is robust.
    // Let's try to simple lookup in service?
    // I will update the service in a next step if needed. 
    // For now, I will assume I can get it.
    
    // Actually, `TeachersService` is not exported yet. 
    // I'll just rely on `PrismaService` inside `CounsellingService` to find the teacher by userId.
    // So I will change `createSession` signature in `CounsellingService` to take `userId`.
    // Wait, I can't edit the service I just wrote without another call.
    // I will write the controller to assume I'm passing `userId` and I'll fix the service in a moment.
    
    return this.counsellingService.createSessionForUser(userId, dto);
  }

  @Get('my-sessions')
  @Roles(Role.STUDENT)
  async getMySessions(@CurrentUser('id') userId: string) {
     return this.counsellingService.getSessionsForStudentUser(userId);
  }

  @Get('counsellor/sessions')
  @Roles(Role.TEACHER)
  async getCounsellorSessions(@CurrentUser('id') userId: string) {
     return this.counsellingService.getSessionsForCounsellorUser(userId);
  }
}
