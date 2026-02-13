
import { PrismaClient } from '@prisma/client';

import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking Teachers in DB...');
  
  const teachers = await prisma.user.findMany({
    where: {
      roles: {
        some: { role: 'TEACHER' }
      }
    },
    include: {
      roles: true,
      teacherProfile: true
    }
  });

  console.log(`Found ${teachers.length} teachers:`);
  teachers.forEach(t => {
    console.log(`- ${t.firstName} ${t.lastName} (${t.email})`);
    console.log(`  Roles: ${t.roles.map(r => r.role).join(', ')}`);
    console.log(`  Profile: ${t.teacherProfile ? 'YES' : 'NO'} (Dept: ${t.teacherProfile?.departmentId})`);
  });

  const smore = await prisma.user.findUnique({
    where: { email: 'smore@ait.edu' },
    include: { roles: true }
  });
  
  if (smore) {
    console.log('\n✅ smore@ait.edu exists with roles:', smore.roles.map(r => r.role));
  } else {
    console.log('\n❌ smore@ait.edu NOT FOUND');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
