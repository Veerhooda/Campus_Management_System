<div align="center">

# 🖥️ AIT Smart Campus Portal

### Modern, Responsive Web Interface for Campus Management

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<strong>A unified React frontend fully integrated with the NestJS backend API for seamless campus management. Customized for Army Institute of Technology, Pune.</strong>

</div>

---

## ✨ Features

### 🎯 Role-Based Portals

| Portal           | Features                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| 👨‍🎓 **Student**   | Dashboard, timetable, attendance stats, notes download, grievances, maintenance |
| 👨‍🏫 **Faculty**   | Class schedule, attendance marking, notes upload, bulk operations               |
| 🔧 **Admin**     | System overview, user management, grievances, broadcast, events                 |
| 🎯 **Organizer** | Event creation, calendar view, AI suggestions, publishing                       |

### 🔗 Full API Integration

- **JWT Authentication** — Login, logout, token refresh with auto-retry
- **Real-time Data** — Dashboards fetch live data from backend
- **Role-based Routing** — Protected routes with access control
- **Error Handling** — Graceful fallbacks and loading states

### 🎨 UI/UX Excellence

- 🌙 **Dark/Light Mode** — System-aware theme switching
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **Fast** — Optimized bundle with code splitting
- 🎭 **Smooth Animations** — Polished micro-interactions
- 🦴 **Loading Skeletons** — Professional loading states

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **Backend running** at `localhost:3000` (see [Backend README](../ait-cms-backend/README.md))

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**Development server:** `http://localhost:5173`

### Environment

```env
# .env (create this file)
VITE_API_URL=http://localhost:3000/api/v1
```

---

## 🔑 Demo Credentials

| Role         | Email               | Password      |
| ------------ | ------------------- | ------------- |
| 🔴 Admin     | `admin@ait.edu`     | `password123` |
| 🟢 Teacher   | `faculty@ait.edu`   | `password123` |
| 🔵 Student   | `student@ait.edu`   | `password123` |
| 🟣 Organizer | `organizer@ait.edu` | `password123` |

---

## 📁 Project Structure

```
src/
├── components/
│   └── shared/              # Reusable UI components
│       ├── Sidebar.tsx      # Role-based navigation
│       ├── Header.tsx       # User info & avatar
│       ├── StatCard.tsx     # Dashboard stat cards
│       └── Layout.tsx       # Main app layout
│
├── pages/
│   ├── admin/               # Admin-only pages
│   │   ├── Dashboard.tsx    # System overview
│   │   ├── Grievances.tsx   # Ticket management
│   │   ├── UserManagement.tsx # User CRUD & roles
│   │   ├── UserManagement.tsx # User CRUD & roles
│   │   ├── Broadcast.tsx    # Role-targeted announcements
│   │   ├── TimetableManagement.tsx # Slot management (Add/Edit/Delete)
│   │   └── OrganizerDashboard.tsx
│   │
│   ├── faculty/             # Faculty-only pages
│   │   ├── Dashboard.tsx    # Today's schedule
│   │   ├── Attendance.tsx   # Bulk attendance marking
│   │   └── NotesUpload.tsx  # Drag-drop file upload
│   │
│   ├── student/             # Student-only pages
│   │   ├── Dashboard.tsx    # Classes, attendance stats
│   │   ├── Notes.tsx        # Browse & download materials
│   │   ├── Grievances.tsx   # Submit grievance tickets
│   │   └── MaintenanceRequests.tsx
│   │
│   ├── shared/              # Cross-role pages
│   │   ├── Schedule.tsx     # Grid & list timetable view
│   │   ├── Notifications.tsx # With mark-as-read
│   │   └── EventCreator.tsx  # Multi-step event form
│   │
│   └── auth/
│       └── LoginPage.tsx    # Quick login buttons
│
├── services/                # API Integration Layer
│   ├── api.ts              # Axios client + JWT interceptors
│   ├── auth.ts             # Login, logout, token management
│   ├── data.ts             # All data services
│   └── index.ts            # Barrel export
│
├── context/
│   ├── AuthContext.tsx     # Auth state + user info
│   └── ThemeContext.tsx    # Dark/light mode
│
├── types/
│   └── index.ts            # TypeScript types (aligned with backend)
│
└── styles/
    └── index.css           # TailwindCSS + custom styles
```

---

## 🔗 API Services

### Authentication (`services/auth.ts`)

```typescript
authService.login({ email, password }); // Returns tokens + user
authService.logout(); // Clears tokens
authService.getMe(); // Get current user
authService.refreshToken(); // Refresh access token
```

### Data Services (`services/data.ts`)

```typescript
// Timetable
timetableService.getStudentTimetable(); // Student's class schedule
timetableService.getTeacherTimetable(); // Teacher's schedule
timetableService.createSlot(data); // Admin create slot
timetableService.deleteSlot(id); // Admin delete slot

// Attendance
attendanceService.getMyAttendance(); // Student's attendance stats
attendanceService.markBulkAttendance(); // Faculty bulk marking

// Notifications
notificationService.getNotifications(); // Paginated list
notificationService.markAsRead(id); // Mark single as read

// Events
eventService.getEvents(); // All events
eventService.createEvent(data); // Create new event
eventService.publishEvent(id); // Publish draft

// Files & Notes
fileService.upload(file, subjectId?); // Upload file (multipart)
fileService.getAll(page, limit); // Browse all files
fileService.getMyFiles(); // Teacher's own uploads
fileService.getDownloadUrl(id); // Get download URL
fileService.delete(id); // Delete own file

// Grievances
grievanceService.getGrievances(); // Admin ticket list
grievanceService.updateStatus(id, status); // Update ticket

// Maintenance
maintenanceService.getRequests(); // Student's requests
maintenanceService.createRequest(data); // Submit new request
```

---

## 🛠 Tech Stack

| Category      | Technology       | Purpose                         |
| ------------- | ---------------- | ------------------------------- |
| **Framework** | React 19         | UI library with latest features |
| **Language**  | TypeScript 5.6   | Type safety & DX                |
| **Build**     | Vite 6           | Fast dev server & bundler       |
| **Styling**   | TailwindCSS 3.4  | Utility-first CSS               |
| **Routing**   | React Router 7   | Client-side navigation          |
| **HTTP**      | Axios            | API requests with interceptors  |
| **Icons**     | Material Symbols | Google's icon library           |
| **Fonts**     | Inter            | Modern, readable typography     |

---

## 🎨 Design System

### Colors

```css
/* Primary */
--primary: #6366f1; /* Indigo */
--primary-dark: #4f46e5;

/* Semantic */
--success: #22c55e; /* Green */
--warning: #f59e0b; /* Amber */
--error: #ef4444; /* Red */
--info: #3b82f6; /* Blue */

/* Surfaces (Dark mode) */
--bg-primary: #0f172a;
--surface-dark: #1e293b;
```

### Typography

| Element  | Font          | Size    |
| -------- | ------------- | ------- |
| Headings | Inter Bold    | 24-32px |
| Body     | Inter Regular | 14-16px |
| Small    | Inter Medium  | 12px    |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width   | Target           |
| ---------- | ------- | ---------------- |
| `sm`       | 640px+  | Mobile landscape |
| `md`       | 768px+  | Tablets          |
| `lg`       | 1024px+ | Small laptops    |
| `xl`       | 1280px+ | Desktops         |

---

## 📦 Available Scripts

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npx tsc --noEmit   # TypeScript validation
```

---

## 🔧 Configuration

### Environment Variables

| Variable       | Description     | Default                        |
| -------------- | --------------- | ------------------------------ |
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api/v1` |

### Vite Config

The app uses Vite with React plugin. See `vite.config.ts` for configuration.

---

## 🤝 Contributing

See the [Contributing Guide](../ait-cms-backend/CONTRIBUTING.md) in the main repository.

---

## 📄 License

MIT © [Veer Hooda](https://github.com/veerhooda)

---

<div align="center">

**Part of the [AIT Smart Campus](https://github.com/veerhooda/AIT_CMS) ecosystem**

[![Backend](https://img.shields.io/badge/See_Also-Backend_API-E0234E?style=for-the-badge&logo=nestjs)](../ait-cms-backend)

</div>
