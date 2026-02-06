<div align="center">

# 🖥️ AIT Smart Campus Portal

### Modern, Responsive Web Interface for Campus Management

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🎯 Role-Based Portals

| Portal           | Features                                                         |
| ---------------- | ---------------------------------------------------------------- |
| 👨‍🎓 **Student**   | Dashboard, courses, schedule, attendance tracking, notifications |
| 👨‍🏫 **Faculty**   | Class management, attendance marking, grading, file uploads      |
| 🔧 **Admin**     | System overview, user management, reports, audit logs            |
| 🎯 **Organizer** | Event creation, AI suggestions, registration management          |

### 🎨 UI/UX Excellence

- 🌙 **Dark/Light Mode** — System-aware theme switching
- 📱 **Fully Responsive** — Mobile-first design
- ♿ **Accessible** — WCAG-compliant components
- ⚡ **Fast** — Optimized bundle with code splitting
- 🎭 **Smooth Animations** — Polished micro-interactions

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development server:** `http://localhost:5173`

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
│   └── shared/              # Reusable components
│       ├── Sidebar.tsx      # Navigation sidebar
│       ├── Header.tsx       # Top header with user menu
│       ├── Card.tsx         # Styled card component
│       └── Modal.tsx        # Modal dialogs
│
├── pages/
│   ├── admin/               # Admin-only pages
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   └── AuditLogs.tsx
│   │
│   ├── faculty/             # Faculty-only pages
│   │   ├── Dashboard.tsx
│   │   ├── MyClasses.tsx
│   │   └── MarkAttendance.tsx
│   │
│   ├── student/             # Student-only pages
│   │   ├── Dashboard.tsx
│   │   ├── MyCourses.tsx
│   │   └── Timetable.tsx
│   │
│   └── shared/              # Cross-role pages
│       ├── Login.tsx
│       ├── Profile.tsx
│       └── Notifications.tsx
│
├── context/
│   ├── AuthContext.tsx      # Authentication state
│   └── ThemeContext.tsx     # Dark/light mode
│
├── types/                   # TypeScript definitions
├── hooks/                   # Custom React hooks
├── utils/                   # Helper functions
└── styles/                  # Global CSS & Tailwind config
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

/* Neutral (Dark mode) */
--bg-primary: #0f172a;
--bg-secondary: #1e293b;
--text-primary: #f8fafc;
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
| `2xl`      | 1536px+ | Large screens    |

---

## 🔧 Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_AI_FEATURES=false
```

---

## 📦 Available Scripts

```bash
npm run dev        # Start dev server with HMR
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # TypeScript validation
```

---

## 🤝 Contributing

See the [Contributing Guide](../ait-cms-backend/CONTRIBUTING.md) in the main repository.

---

## 📄 License

MIT © [Veer Hooda](https://github.com/veerhooda)

---

<div align="center">

**Part of the [AIT Smart Campus](https://github.com/veerhooda/AIT_CMS) ecosystem**

</div>
