import { PrismaClient, Role, DayOfWeek } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Create PostgreSQL connection pool for Prisma 7
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ait_cms';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash password
  const passwordHash = await bcrypt.hash('password123', 12);

  // Create Departments
  console.log('Creating departments...');
  const csDept = await prisma.department.upsert({
    where: { code: 'CSE' },
    update: {},
    create: {
      name: 'Computer Science & Engineering',
      code: 'CSE',
    },
  });

  const eceDept = await prisma.department.upsert({
    where: { code: 'ECE' },
    update: {},
    create: {
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
    },
  });

  const mechDept = await prisma.department.upsert({
    where: { code: 'ME' },
    update: {},
    create: {
      name: 'Mechanical Engineering',
      code: 'ME',
    },
  });

  // Create Rooms
  console.log('Creating rooms...');
  const room101 = await prisma.room.upsert({
    where: { name: 'LH-101' },
    update: {},
    create: {
      name: 'LH-101',
      building: 'Main Block',
      capacity: 60,
      hasProjector: true,
    },
  });

  const room102 = await prisma.room.upsert({
    where: { name: 'LH-102' },
    update: {},
    create: {
      name: 'LH-102',
      building: 'Main Block',
      capacity: 60,
      hasProjector: true,
    },
  });

  const lab1 = await prisma.room.upsert({
    where: { name: 'LAB-CS-1' },
    update: {},
    create: {
      name: 'LAB-CS-1',
      building: 'CS Block',
      capacity: 40,
      hasProjector: true,
    },
  });

  const auditorium = await prisma.room.upsert({
    where: { name: 'AUDITORIUM' },
    update: {},
    create: {
      name: 'AUDITORIUM',
      building: 'Central Block',
      capacity: 500,
      hasProjector: true,
    },
  });

  // Create Classes
  console.log('Creating classes...');
  const cse3a = await prisma.class.upsert({
    where: {
      departmentId_year_section: {
        departmentId: csDept.id,
        year: 3,
        section: 'A',
      },
    },
    update: {},
    create: {
      name: 'CSE-3A',
      year: 3,
      section: 'A',
      departmentId: csDept.id,
    },
  });

  const cse3b = await prisma.class.upsert({
    where: {
      departmentId_year_section: {
        departmentId: csDept.id,
        year: 3,
        section: 'B',
      },
    },
    update: {},
    create: {
      name: 'CSE-3B',
      year: 3,
      section: 'B',
      departmentId: csDept.id,
    },
  });

  // Create Subjects
  console.log('Creating subjects...');
  const dsa = await prisma.subject.upsert({
    where: { code: 'CS301' },
    update: {},
    create: {
      name: 'Data Structures & Algorithms',
      code: 'CS301',
      credits: 4,
      departmentId: csDept.id,
    },
  });

  const dbms = await prisma.subject.upsert({
    where: { code: 'CS302' },
    update: {},
    create: {
      name: 'Database Management Systems',
      code: 'CS302',
      credits: 4,
      departmentId: csDept.id,
    },
  });

  const os = await prisma.subject.upsert({
    where: { code: 'CS303' },
    update: {},
    create: {
      name: 'Operating Systems',
      code: 'CS303',
      credits: 3,
      departmentId: csDept.id,
    },
  });

  // Create Admin User
  console.log('Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ait.edu' },
    update: {},
    create: {
      email: 'admin@ait.edu',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+91-9876543210',
      roles: {
        create: [{ role: Role.ADMIN }],
      },
      adminProfile: {
        create: {},
      },
    },
  });
  console.log(`  ✓ Admin: admin@ait.edu / password123`);

  // Create Teacher User
  console.log('Creating teacher user...');
  const teacherUser = await prisma.user.upsert({
    where: { email: 'faculty@ait.edu' },
    update: {},
    create: {
      email: 'faculty@ait.edu',
      passwordHash,
      firstName: 'Dr. Rahul',
      lastName: 'Sharma',
      phone: '+91-9876543211',
      roles: {
        create: [{ role: Role.TEACHER }],
      },
      teacherProfile: {
        create: {
          employeeId: 'EMP001',
          departmentId: csDept.id,
        },
      },
    },
    include: {
      teacherProfile: true,
    },
  });
  console.log(`  ✓ Teacher: faculty@ait.edu / password123`);

  // Create Student User
  console.log('Creating student user...');
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@ait.edu' },
    update: {},
    create: {
      email: 'student@ait.edu',
      passwordHash,
      firstName: 'Amit',
      lastName: 'Kumar',
      phone: '+91-9876543212',
      roles: {
        create: [{ role: Role.STUDENT }],
      },
      studentProfile: {
        create: {
          rollNumber: 'CSE2021001',
          enrollmentYear: 2021,
          classId: cse3a.id,
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });
  console.log(`  ✓ Student: student@ait.edu / password123`);

  // Create Organizer User
  console.log('Creating organizer user...');
  const organizerUser = await prisma.user.upsert({
    where: { email: 'organizer@ait.edu' },
    update: {},
    create: {
      email: 'organizer@ait.edu',
      passwordHash,
      firstName: 'Priya',
      lastName: 'Patel',
      phone: '+91-9876543213',
      roles: {
        create: [{ role: Role.ORGANIZER }],
      },
      organizerProfile: {
        create: {},
      },
    },
    include: {
      organizerProfile: true,
    },
  });
  console.log(`  ✓ Organizer: organizer@ait.edu / password123`);

  // Create additional students
  console.log('Creating additional students...');
  for (let i = 2; i <= 5; i++) {
    await prisma.user.upsert({
      where: { email: `student${i}@ait.edu` },
      update: {},
      create: {
        email: `student${i}@ait.edu`,
        passwordHash,
        firstName: `Student`,
        lastName: `${i}`,
        roles: {
          create: [{ role: Role.STUDENT }],
        },
        studentProfile: {
          create: {
            rollNumber: `CSE202100${i}`,
            enrollmentYear: 2021,
            classId: cse3a.id,
          },
        },
      },
    });
  }
  console.log(`  ✓ Created 4 additional students`);

  // Create Timetable Slots (if teacher profile exists)
  if (teacherUser.teacherProfile) {
    console.log('Creating timetable slots...');
    
    // Monday DSA
    await prisma.timetableSlot.upsert({
      where: {
        dayOfWeek_startTime_classId: {
          dayOfWeek: DayOfWeek.MONDAY,
          startTime: '09:00',
          classId: cse3a.id,
        },
      },
      update: {},
      create: {
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '09:00',
        endTime: '10:00',
        classId: cse3a.id,
        subjectId: dsa.id,
        teacherId: teacherUser.teacherProfile.id,
        roomId: room101.id,
      },
    });

    // Monday DBMS
    await prisma.timetableSlot.upsert({
      where: {
        dayOfWeek_startTime_classId: {
          dayOfWeek: DayOfWeek.MONDAY,
          startTime: '10:00',
          classId: cse3a.id,
        },
      },
      update: {},
      create: {
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '10:00',
        endTime: '11:00',
        classId: cse3a.id,
        subjectId: dbms.id,
        teacherId: teacherUser.teacherProfile.id,
        roomId: room101.id,
      },
    });

    // Tuesday OS
    await prisma.timetableSlot.upsert({
      where: {
        dayOfWeek_startTime_classId: {
          dayOfWeek: DayOfWeek.TUESDAY,
          startTime: '09:00',
          classId: cse3a.id,
        },
      },
      update: {},
      create: {
        dayOfWeek: DayOfWeek.TUESDAY,
        startTime: '09:00',
        endTime: '10:00',
        classId: cse3a.id,
        subjectId: os.id,
        teacherId: teacherUser.teacherProfile.id,
        roomId: room101.id,
      },
    });

    console.log(`  ✓ Created 3 timetable slots`);
  }

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('   Admin:     admin@ait.edu / password123');
  console.log('   Teacher:   faculty@ait.edu / password123');
  console.log('   Student:   student@ait.edu / password123');
  console.log('   Organizer: organizer@ait.edu / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
