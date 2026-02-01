
import { Student, AttendanceStatus } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '2023-CS-001',
    rollNo: '001',
    name: 'Alexander Bennett',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0MKqBMxC0lcAPeL76ZLp4pCV91DYILNedeU5mRgVIFwn7UBUJIo6WAfXkM_BhuIYEKUIOWCfjE09WZwUOVvb5IsoAxf6emhcdCfnVe4HIdHVDa92jfYlM_W1VSFSmZdfjejF7dr9CKFQX0FLBXb5BDtTVkTsiKWxO77iw8NkpbaF6VAIrcFs_hVG1rBpm8FTsWSmZKuKmxdS9aGxaKPoixOA74sx3NzNU5RfY0ZAzm0aUcGHZzM9anUbdOl1hl6brCo1OHNHYh-ZR',
    attendancePercentage: 92,
    status: AttendanceStatus.PRESENT
  },
  {
    id: '2023-CS-002',
    rollNo: '002',
    name: 'Charlotte Hale',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9o63IxQRVEL7Vj9fuMtp19TSpUArCa5PNtV_ioVfyb54T31jp9E9bgnYSNxK1lXlysOAYPS_6alJO1VwobRDtlKcJyQXWuRx1d8GWgp_6Quyc_sRVAu1BJpFQRPNuVV7jYhOTl1o0dh6Zt5cKAPN1VZVXsb8dRDEsmFOMyD5bpS_LNsH1iG_qkP_KS_-Ogl-G8OifscAtw-FMYdS7FDUsInXVs2EDi3lZrmgeM5ZRkMZ0IJauvf4jEEuXuFps0_B59pLYNZF9tg8',
    attendancePercentage: 85,
    status: AttendanceStatus.LATE
  },
  {
    id: '2023-CS-003',
    rollNo: '003',
    name: 'Elias Larson',
    attendancePercentage: 68,
    status: AttendanceStatus.ABSENT
  },
  {
    id: '2023-CS-004',
    rollNo: '004',
    name: 'James Morrison',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZ9tuBcG5VRlNszvHh35hkVKqrOTX6ZZBXUbJmRotEUZOds41uIjTdwjI0Et6Aemm_kTSx18mtGhlLL8zHb0xAFkSVou_u-j_3Ks0owduW6HvyOoBQT6uCXyBkw3ygfgfGDTFXnK-CPmPmT_WEkJuYK94nT9e83A1uzSXjvVOJ-MUl15RdmKhR3TsBCUPPZhMmTshZCKCpj9sBXQYT1YZOQyVsinjJhWgXXJMiQ7k-IXtSVAZ2rOcdscS7Tzq8Qt9to2-mrh_B94Wb',
    attendancePercentage: 98,
    status: AttendanceStatus.PRESENT
  },
  {
    id: '2023-CS-005',
    rollNo: '005',
    name: 'Sophia Khan',
    attendancePercentage: 100,
    status: AttendanceStatus.PRESENT
  },
  {
    id: '2023-CS-006',
    rollNo: '006',
    name: 'Marcus Thorne',
    avatarUrl: 'https://picsum.photos/id/64/100/100',
    attendancePercentage: 74,
    status: AttendanceStatus.PRESENT
  },
  {
    id: '2023-CS-007',
    rollNo: '007',
    name: 'Lily Evans',
    avatarUrl: 'https://picsum.photos/id/65/100/100',
    attendancePercentage: 88,
    status: AttendanceStatus.PRESENT
  }
];

export const COURSES = ['Mathematics 101', 'Physics 202', 'Chemistry 303', 'History 101'];
export const SECTIONS = ['Class 10-A', 'Class 10-B', 'Class 11-A', 'Class 11-B'];
export const SESSIONS = ['09:00 AM - 10:00 AM', '10:15 AM - 11:15 AM', '11:30 AM - 12:30 PM'];
