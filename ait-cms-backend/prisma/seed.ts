import { PrismaClient, Role, DayOfWeek } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ait_cms';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const BRANCHES = [
  { name: 'Computer Engineering', code: 'COMP' },
  { name: 'Information Technology', code: 'IT' },
  { name: 'Electronics & Telecommunication', code: 'ENTC' },
  { name: 'Mechanical Engineering', code: 'MECH' },
  { name: 'Automation & Robotics', code: 'ARE' },
];

const SECTIONS = ['A', 'B'];
const YEARS = [1, 2, 3, 4];

async function main() {
  console.log('🌱 Starting database seed...');
  const passwordHash = await bcrypt.hash('password123', 12);

  // 1. Create Departments
  console.log('Creating departments...');
  const deptMap = new Map();
  
  for (const branch of BRANCHES) {
    const dept = await prisma.department.upsert({
      where: { code: branch.code },
      update: {},
      create: { name: branch.name, code: branch.code },
    });
    deptMap.set(branch.code, dept.id);
  }

  // 2. Create Rooms
  console.log('Creating rooms...');
  const rooms = [
    { name: 'LH-101', building: 'Main Block', capacity: 60 },
    { name: 'LH-102', building: 'Main Block', capacity: 60 },
    { name: 'LAB-IT-1', building: 'IT Block', capacity: 40 },
    { name: 'LAB-COMP-1', building: 'Comp Block', capacity: 40 },
    { name: 'AUDITORIUM', building: 'Central Block', capacity: 500 },
  ];

  for (const r of rooms) {
    await prisma.room.upsert({
      where: { name: r.name },
      update: {},
      create: { ...r, hasProjector: true },
    });
  }

  // 3. Create Classes (5 Branches * 4 Years * 2 Sections = 40 classes)
  console.log('Creating classes...');
  for (const branch of BRANCHES) {
    const deptId = deptMap.get(branch.code);
    for (const year of YEARS) {
      for (const section of SECTIONS) {
        // e.g., COMP-SE-A (using simple naming: COMP-1A, COMP-2A, etc. or just numeric year)
        // Let's use: COMP-YEAR-SECTION (e.g. COMP-2-A)
        const className = `${branch.code}-${year}-${section}`;
        await prisma.class.upsert({
          where: {
            departmentId_year_section: { departmentId: deptId, year, section },
          },
          update: {},
          create: {
            name: className,
            year,
            section,
            departmentId: deptId,
          },
        });
      }
    }
  }

  // 4. Create Subjects
  console.log('Creating subjects...');
  const itDeptId = deptMap.get('IT');
  const subjects = [
    { name: 'Object Oriented Programming', code: 'OOP', credit: 4, deptId: itDeptId },
    { name: 'Digital Transformation & Innovation', code: 'DTI', credit: 3, deptId: itDeptId },
    { name: 'Engineering Skills & Practices', code: 'ESP', credit: 2, deptId: itDeptId },
    { name: 'Constitution of India', code: 'COI', credit: 1, deptId: itDeptId },
    { name: 'Engineering Mathematics-2', code: 'EM2', credit: 4, deptId: itDeptId }, // Usually generic, assigning to IT for now or create generic dept
    { name: 'Advanced Software Engineering-2', code: 'ASE2', credit: 4, deptId: itDeptId },
    { name: 'Basic Electrical & Electronics', code: 'BEEE', credit: 3, deptId: itDeptId },
    { name: 'Basic Electronics Engineering', code: 'BXE', credit: 3, deptId: itDeptId },
  ];

  const subjectMap = new Map();
  for (const sub of subjects) {
    const s = await prisma.subject.upsert({
      where: { code: sub.code },
      update: {},
      create: {
        name: sub.name,
        code: sub.code,
        credits: sub.credit,
        departmentId: sub.deptId,
      },
    });
    subjectMap.set(sub.code, s.id);
  }

  // 5. Create Users (Admin)
  console.log('Creating admin...');
  await prisma.user.upsert({
    where: { email: 'admin@ait.edu' },
    update: {},
    create: {
      email: 'admin@ait.edu',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      roles: { create: [{ role: Role.ADMIN }] },
      adminProfile: { create: {} },
    },
  });

  // 6. Create Teachers (IT Department)
  console.log('Creating IT faculty...');
  const facultyList = [
    { first: 'Snehal', last: 'More', email: 'smore@ait.edu', empId: 'IT001' },
    { first: 'Monali', last: 'Bachhav', email: 'mbachhav@ait.edu', empId: 'IT002' },
    { first: 'Snehal', last: 'Shinde', email: 'sshinde@ait.edu', empId: 'IT003' },
    { first: 'Sachin', last: 'Tanwade', email: 'stanwade@ait.edu', empId: 'IT004' },
    { first: 'Sachin', last: 'Gaikwad', email: 'sgaikwad@ait.edu', empId: 'IT005' },
  ];

  for (const f of facultyList) {
    await prisma.user.upsert({
      where: { email: f.email },
      update: {},
      create: {
        email: f.email,
        passwordHash,
        firstName: f.first,
        lastName: f.last,
        roles: { create: [{ role: Role.TEACHER }] },
        teacherProfile: {
          create: {
            employeeId: f.empId,
            departmentId: itDeptId,
          },
        },
      },
    });
  }

  // 7. Create Demo Student (IT, Year 2, Section A)
  console.log('Creating demo student...');
  const it2aClass = await prisma.class.findFirstOrThrow({
    where: { departmentId: itDeptId, year: 2, section: 'A' },
  });

  await prisma.user.upsert({
    where: { email: 'student@ait.edu' },
    update: {
      studentProfile: {
        update: { registrationNumber: 'IT2024001' }
      }
    },
    create: {
      email: 'student@ait.edu',
      passwordHash,
      firstName: 'Amit',
      lastName: 'Kumar',
      roles: { create: [{ role: Role.STUDENT }] },
      studentProfile: {
        create: {
          rollNumber: '3001',
          registrationNumber: 'IT2024001', // New field
          enrollmentYear: 2024,
          classId: it2aClass.id,
        },
      },
    },
  });

  console.log('\n✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
