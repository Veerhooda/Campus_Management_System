<div align="center">

<img src="smart-campus-unified/public/assets/ait-logo.png" alt="AIT Logo" width="80" />

# 🎓 AIT Smart Campus Management System

### Army Institute of Technology, Pune — "Onward to Glory"

#### The Complete Digital Infrastructure for Modern Educational Institutions

[![Frontend](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](./smart-campus-unified)
[![Backend](https://img.shields.io/badge/Backend-NestJS_10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](./ait-cms-backend)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A full-stack campus management platform built for AIT Pune, featuring a React frontend and NestJS backend to streamline academic operations, enhance student engagement, and empower administrators.</strong>
</p>

[Live Demo](#-demo) •
[Features](#-features) •
[Quick Start](#-quick-start) •
[Architecture](#-architecture) •
[Documentation](#-documentation)

---

![Campus Dashboard Preview](https://img.shields.io/badge/📊_Dashboard-Preview-blue?style=flat-square)
![Timetable Management](https://img.shields.io/badge/📅_Timetable-Smart_Scheduling-green?style=flat-square)
![Attendance Tracking](https://img.shields.io/badge/✅_Attendance-Real_time-orange?style=flat-square)

</div>

---

## 🌟 Overview

**AIT Smart Campus** is a comprehensive, production-grade campus management system built for **Army Institute of Technology, Pune** (Est. 1994). The system consists of:

| Component       | Technology         | Description                                              |
| --------------- | ------------------ | -------------------------------------------------------- |
| 🖥️ **Frontend** | React 19 + Vite    | Modern, responsive web portal with role-based interfaces |
| ⚙️ **Backend**  | NestJS 10 + Prisma | Scalable REST API with PostgreSQL database               |

### What Makes It Special?

```
┌─────────────────────────────────────────────────────────────────────┐
│                     🎓 AIT Smart Campus                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   👨‍🎓 STUDENTS        👨‍🏫 FACULTY         🔧 ADMIN        🎯 ORGANIZER │
│   ┌─────────┐       ┌─────────┐       ┌─────────┐      ┌─────────┐  │
│   │Dashboard│       │ Classes │       │ Users   │      │ Events  │  │
│   │Courses  │       │Attendance│      │ Reports │      │Planning │  │
│   │Schedule │       │ Grading │       │ Audit   │      │   AI    │  │
│   └─────────┘       └─────────┘       └─────────┘      └─────────┘  │
│                                                                     │
│   ────────────────── Unified Experience ──────────────────────────  │
│                                                                     │
│   🌙 Dark Mode   📱 Responsive   🔐 Secure   ⚡ Fast   ♿ Accessible   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication & Security

- JWT-based authentication with refresh token rotation
- Role-based access control (RBAC) — Admin, Teacher, Student, Organizer
- Rate limiting & security headers

### 👥 User Management

- Multi-role user profiles with department/class assignments
- Bulk operations & soft deactivation
- Complete audit trail

### 📚 Academic Management

- **Smart Timetable** — Admin UI for creating/editing/deleting slots with conflict detection for classes, teachers, and rooms
- **Attendance Tracking** — Bulk marking with per-student analytics
- **Notes & Materials** — Faculty upload with drag-and-drop, student browse & download

### 🎉 Campus Life

- **Event Management** — Create, publish, register with capacity limits
- **Grievance System** — Submit → Assign → Resolve workflow
- **Maintenance Requests** — Priority-based facility management

### 🔔 Communication

- **Real-time Notifications** — Instant alerts for updates, assignments, and events
- **Smart Broadcasts**
  - **Admin**: Target students by specific Department and Year (FE, SE, TE, BE)
  - **Faculty**: Instant announcements to their own department's students and colleagues
- **File Storage** — Secure local/S3 storage for notes and assignments

---

## 🏗 Architecture

```
AIT_CMS/
├── smart-campus-unified/          # 🖥️ FRONTEND
│   ├── public/assets/             # AIT branding (logo, campus images)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Role-based page modules
│   │   │   ├── admin/             # Admin dashboard, timetable mgmt
│   │   │   ├── faculty/           # Faculty portal
│   │   │   ├── student/           # Student portal
│   │   │   └── shared/            # Cross-role pages
│   │   ├── context/               # Auth & Theme contexts
│   │   └── types/                 # TypeScript definitions
│   └── package.json
│
├── ait-cms-backend/               # ⚙️ BACKEND
│   ├── src/
│   │   ├── modules/               # Feature modules
│   │   │   ├── auth/              # Authentication
│   │   │   ├── users/             # User management
│   │   │   ├── students/          # Student profiles
│   │   │   ├── teachers/          # Teacher profiles
│   │   │   ├── timetable/         # Scheduling
│   │   │   ├── attendance/        # Attendance tracking
│   │   │   ├── events/            # Event management
│   │   │   ├── grievances/        # Ticket system
│   │   │   ├── maintenance/       # Facility requests
│   │   │   ├── files/             # File storage
│   │   │   └── notifications/     # Notifications
│   │   ├── common/                # Guards, filters, decorators
│   │   └── prisma/                # Database service
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (20+ models)
│   │   └── seed.ts                # Test data seeder
│   └── docker-compose.yml         # Local infrastructure
│
└── README.md                      # You are here!
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Docker** & Docker Compose (for backend)
- **npm** or **pnpm**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/veerhooda/AIT_CMS.git
cd AIT_CMS
```

### 2️⃣ Start the Backend

```bash
cd ait-cms-backend

# Install dependencies
npm install

# Start database & cache
docker-compose up -d

# Setup database
npm run db:push
npm run db:seed

# Start server
npm run start:dev
```

**Backend running at:** `http://localhost:3000/api/v1`

### 3️⃣ Start the Frontend

```bash
cd smart-campus-unified

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend running at:** `http://localhost:5173`

---

## 🔑 Test Credentials

| Role             | Email               | Password      |
| ---------------- | ------------------- | ------------- |
| 🔴 **Admin**     | `admin@ait.edu`     | `password123` |
| 🟢 **Teacher**   | `faculty@ait.edu`   | `password123` |
| 🔵 **Student**   | `student@ait.edu`   | `password123` |
| 🟣 **Organizer** | `organizer@ait.edu` | `password123` |

---

## 🛠 Tech Stack

### Frontend

| Technology     | Purpose      |
| -------------- | ------------ |
| React 19       | UI Framework |
| TypeScript 5   | Type Safety  |
| Vite 6         | Build Tool   |
| TailwindCSS 3  | Styling      |
| React Router 7 | Routing      |

### Backend

| Technology     | Purpose        |
| -------------- | -------------- |
| NestJS 10      | API Framework  |
| TypeScript 5   | Type Safety    |
| Prisma 7       | ORM            |
| PostgreSQL 16  | Database       |
| Redis 7        | Cache & Queues |
| JWT + Passport | Authentication |

---

## 📖 Documentation

| Document                                                        | Description                         |
| --------------------------------------------------------------- | ----------------------------------- |
| [Backend README](./ait-cms-backend/README.md)                   | API documentation, endpoints, setup |
| [Frontend README](./smart-campus-unified/README.md)             | Component structure, pages, styling |
| [Contributing Guide](./CONTRIBUTING.md)                         | How to contribute                   |
| [API Endpoints](./ait-cms-backend/README.md#-api-documentation) | Complete API reference              |

---

## 🎯 Roadmap

- [x] Core authentication & RBAC
- [x] User management (Admin, Teacher, Student, Organizer)
- [x] Timetable API with conflict detection
- [x] **Admin Timetable Management UI** — Weekly grid, add/edit/delete slots
- [x] Attendance tracking & analytics
- [x] Event management with registration
- [x] Grievance & maintenance ticketing
- [x] File storage (local disk + S3-compatible)
- [x] Notes upload (faculty) & download (student)
- [x] Notification system
- [x] Broadcast announcements
- [x] **AIT Pune branding** — Campus slideshow, logo integration, dark mode support
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Video conferencing integration

---

## 🤝 Contributing

Contributions are welcome! Please see the [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Veer Hooda](https://github.com/veerhooda)**

[![GitHub](https://img.shields.io/badge/GitHub-veerhooda-181717?style=for-the-badge&logo=github)](https://github.com/veerhooda)
[![Stars](https://img.shields.io/github/stars/veerhooda/AIT_CMS?style=for-the-badge)](https://github.com/veerhooda/Campus_Management_System/stargazers)

</div>
