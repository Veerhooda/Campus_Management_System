<div align="center">

# 🎓 AIT Smart Campus Management System

### A Modern, Scalable Backend for Next-Generation Educational Institutions

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<p align="center">
  <strong>Transform campus operations with intelligent automation, real-time insights, and seamless collaboration.</strong>
</p>

[Getting Started](#-quick-start) •
[Features](#-features) •
[API Documentation](#-api-documentation) •
[Architecture](#-architecture) •
[Contributing](#-contributing)

</div>

---

## 🌟 Overview

**AIT Smart Campus** is a comprehensive, production-ready backend system designed to digitize and streamline the entire lifecycle of campus management. Built with enterprise-grade technologies, it provides a robust foundation for managing students, faculty, academics, events, and campus facilities—all through a unified, secure API.

### Why AIT Smart Campus?

| Traditional Systems            | AIT Smart Campus                              |
| ------------------------------ | --------------------------------------------- |
| Siloed data across departments | 🔗 Unified data platform                      |
| Manual attendance sheets       | ⚡ Real-time digital tracking                 |
| Paper-based grievances         | 📱 Instant ticket management                  |
| Static timetables              | 🔄 Dynamic scheduling with conflict detection |
| Limited access control         | 🔐 Fine-grained role-based permissions        |

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based authentication** with access/refresh token rotation
- **Role-based access control (RBAC)** supporting 4 distinct roles
- **Rate limiting** to prevent abuse
- **Secure password hashing** with bcrypt
- **Helmet** middleware for HTTP security headers

### 👥 User Management

- Multi-role user profiles (Admin, Teacher, Student, Organizer)
- Department and class assignments
- Soft deactivation for data integrity
- Bulk user operations

### 📚 Academic Management

- **Timetable Scheduling** with automatic conflict detection
  - Class, teacher, and room collision prevention
  - Day-of-week and time slot management
- **Attendance Tracking**
  - Bulk marking for entire classes
  - Per-student and per-subject analytics
  - Percentage calculations and summaries

### 🎉 Campus Life

- **Event Management**
  - Create, publish, and cancel events
  - Registration with capacity limits
  - Organizer and venue management
- **Notifications System**
  - Real-time user notifications
  - Bulk announcements
  - Read/unread tracking

### 🛠 Operations

- **Grievance Ticketing** — Submit → Assign → Resolve workflow
- **Maintenance Requests** — Priority-based facility management
- **File Storage** — S3-compatible uploads with presigned URLs

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (NestJS)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Auth   │ │  Users  │ │ Academic│ │ Events  │ │ Support │   │
│  │ Module  │ │ Module  │ │ Modules │ │ Module  │ │ Modules │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │           │           │         │
│  ┌────┴───────────┴───────────┴───────────┴───────────┴────┐   │
│  │                    Prisma ORM Layer                      │   │
│  └──────────────────────────┬──────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │PostgreSQL │   │   Redis   │   │   MinIO   │
        │ Database  │   │   Cache   │   │   (S3)    │
        └───────────┘   └───────────┘   └───────────┘
```

### Tech Stack

| Layer         | Technology     | Purpose                      |
| ------------- | -------------- | ---------------------------- |
| **Runtime**   | Node.js 20+    | JavaScript runtime           |
| **Framework** | NestJS 10      | Enterprise Node.js framework |
| **Language**  | TypeScript 5   | Type-safe development        |
| **ORM**       | Prisma 7       | Type-safe database access    |
| **Database**  | PostgreSQL 16  | Primary data store           |
| **Cache**     | Redis 7        | Session & queue management   |
| **Storage**   | MinIO / AWS S3 | File uploads                 |
| **Auth**      | Passport + JWT | Authentication strategy      |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Docker** & Docker Compose
- **pnpm** or **npm**

### 1️⃣ Clone & Install

```bash
git clone https://github.com/veerhooda/ait-cms-backend.git
cd ait-cms-backend
npm install
```

### 2️⃣ Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration (defaults work for local development)
```

### 3️⃣ Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify containers are running
docker-compose ps
```

### 4️⃣ Database Setup

```bash
# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### 5️⃣ Launch! 🎉

```bash
npm run start:dev
```

**Server running at:** `http://localhost:3000/api/v1`

---

## 🔑 Test Credentials

After seeding, use these accounts to explore the API:

| Role         | Email               | Password      |
| ------------ | ------------------- | ------------- |
| 🔴 Admin     | `admin@ait.edu`     | `password123` |
| 🟢 Teacher   | `faculty@ait.edu`   | `password123` |
| 🔵 Student   | `student@ait.edu`   | `password123` |
| 🟣 Organizer | `organizer@ait.edu` | `password123` |

---

## 📖 API Documentation

### Authentication

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ait.edu", "password": "password123"}'

# Use the returned accessToken for authenticated requests
curl -H "Authorization: Bearer <accessToken>" \
  http://localhost:3000/api/v1/users
```

### Core Endpoints

<details>
<summary><strong>🔐 Authentication</strong></summary>

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| `POST` | `/auth/login`   | User login             |
| `POST` | `/auth/refresh` | Refresh tokens         |
| `POST` | `/auth/logout`  | Logout current session |
| `GET`  | `/auth/me`      | Get current user       |

</details>

<details>
<summary><strong>👥 Users</strong></summary>

| Method   | Endpoint     | Access | Description    |
| -------- | ------------ | ------ | -------------- |
| `POST`   | `/users`     | Admin  | Create user    |
| `GET`    | `/users`     | Admin  | List all users |
| `GET`    | `/users/:id` | Admin  | Get user by ID |
| `PATCH`  | `/users/:id` | Admin  | Update user    |
| `DELETE` | `/users/:id` | Admin  | Delete user    |

</details>

<details>
<summary><strong>🎓 Students</strong></summary>

| Method | Endpoint                   | Access         | Description    |
| ------ | -------------------------- | -------------- | -------------- |
| `POST` | `/students/:userId`        | Admin          | Create profile |
| `GET`  | `/students`                | Admin, Teacher | List students  |
| `GET`  | `/students/me`             | Student        | Own profile    |
| `GET`  | `/students/class/:classId` | Admin, Teacher | By class       |

</details>

<details>
<summary><strong>📅 Timetable</strong></summary>

| Method | Endpoint                 | Access         | Description      |
| ------ | ------------------------ | -------------- | ---------------- |
| `POST` | `/timetable`             | Admin          | Create slot      |
| `GET`  | `/timetable/class/:id`   | Auth           | Class timetable  |
| `GET`  | `/timetable/teacher/:id` | Admin, Teacher | Teacher schedule |

</details>

<details>
<summary><strong>✅ Attendance</strong></summary>

| Method | Endpoint                        | Access  | Description     |
| ------ | ------------------------------- | ------- | --------------- |
| `POST` | `/attendance/bulk`              | Teacher | Mark attendance |
| `GET`  | `/attendance/me`                | Student | Own attendance  |
| `GET`  | `/attendance/class/:id/summary` | Teacher | Class summary   |

</details>

<details>
<summary><strong>🎉 Events</strong></summary>

| Method | Endpoint               | Access    | Description     |
| ------ | ---------------------- | --------- | --------------- |
| `POST` | `/events`              | Organizer | Create event    |
| `GET`  | `/events/upcoming`     | Auth      | Upcoming events |
| `POST` | `/events/:id/register` | Auth      | Register        |
| `POST` | `/events/:id/publish`  | Organizer | Publish event   |

</details>

<details>
<summary><strong>📬 Notifications</strong></summary>

| Method | Endpoint                      | Access | Description      |
| ------ | ----------------------------- | ------ | ---------------- |
| `GET`  | `/notifications`              | Auth   | My notifications |
| `GET`  | `/notifications/unread-count` | Auth   | Unread count     |
| `POST` | `/notifications/read-all`     | Auth   | Mark all read    |

</details>

---

## 📁 Project Structure

```
ait-cms-backend/
├── prisma/
│   ├── schema.prisma          # Database schema (20+ models)
│   └── seed.ts                # Test data seeder
├── src/
│   ├── common/
│   │   ├── decorators/        # @Roles, @Public, @CurrentUser
│   │   ├── guards/            # RolesGuard
│   │   ├── filters/           # AllExceptionsFilter
│   │   └── interceptors/      # TransformInterceptor
│   ├── config/                # Environment configuration
│   ├── prisma/                # Database service
│   └── modules/
│       ├── auth/              # Authentication
│       ├── users/             # User management
│       ├── students/          # Student profiles
│       ├── teachers/          # Teacher profiles
│       ├── timetable/         # Class scheduling
│       ├── attendance/        # Attendance tracking
│       ├── events/            # Event management
│       ├── grievances/        # Grievance tickets
│       ├── maintenance/       # Maintenance requests
│       ├── files/             # File uploads
│       └── notifications/     # User notifications
├── docker-compose.yml         # Local infrastructure
├── .env.example               # Environment template
└── package.json
```

---

## 🛠 Development

### Available Scripts

```bash
npm run start:dev     # Start development server with hot reload
npm run start:prod    # Start production server
npm run build         # Build for production

npm run db:push       # Push schema changes to database
npm run db:seed       # Seed database with test data
npm run db:studio     # Open Prisma Studio GUI

npm run lint          # Run ESLint
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
```

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Apply migrations in production
npx prisma migrate deploy
```

---

## 🔒 Environment Variables

| Variable                 | Description                  | Default                                                 |
| ------------------------ | ---------------------------- | ------------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/ait_cms` |
| `JWT_SECRET`             | Secret for JWT signing       | (required)                                              |
| `JWT_ACCESS_EXPIRATION`  | Access token TTL             | `15m`                                                   |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL            | `7d`                                                    |
| `REDIS_HOST`             | Redis host                   | `localhost`                                             |
| `REDIS_PORT`             | Redis port                   | `6379`                                                  |
| `S3_ENDPOINT`            | S3/MinIO endpoint            | `http://localhost:9000`                                 |
| `S3_ACCESS_KEY`          | S3 access key                | (optional)                                              |
| `S3_SECRET_KEY`          | S3 secret key                | (optional)                                              |
| `S3_BUCKET`              | S3 bucket name               | `ait-cms-files`                                         |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for modern educational institutions**

[![Stars](https://img.shields.io/github/stars/veerhooda/ait-cms-backend?style=social)](https://github.com/veerhooda/ait-cms-backend)
[![Follow](https://img.shields.io/github/followers/veerhooda?style=social)](https://github.com/veerhooda)

</div>
