# AIT Smart Campus Portal 🎓

A unified, production-ready campus management system built with React, TypeScript, and TailwindCSS.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?logo=tailwindcss)

## Features

### 🎯 Role-Based Portals

- **Student Portal** – Dashboard, courses, schedule, attendance tracking
- **Faculty Portal** – Class management, attendance marking, grading
- **Admin Dashboard** – System overview, user management, audit logs
- **Organizer Portal** – Event management with AI suggestions

### ✨ Key Highlights

- 🌙 Dark/Light mode support
- 📱 Fully responsive design
- 🔐 Role-based authentication
- 📅 Interactive timetable with grid/list views
- 📊 Real-time attendance marking
- 🎫 Grievance ticket management
- 🔔 Notification center with filtering
- 🤖 AI-powered features (event suggestions)

## Tech Stack

| Category   | Technology           |
| ---------- | -------------------- |
| Framework  | React 19             |
| Language   | TypeScript           |
| Build Tool | Vite                 |
| Styling    | TailwindCSS          |
| Routing    | React Router v7      |
| Icons      | Material Symbols     |
| Fonts      | Inter (Google Fonts) |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173 and login with:

- **Student**: `student@ait.edu` (any password)
- **Faculty**: `faculty@ait.edu` (any password)
- **Admin**: `admin@ait.edu` (any password)

## Project Structure

```
src/
├── components/shared/     # Reusable components (Sidebar, Header, etc.)
├── context/               # React contexts (Auth, Theme)
├── pages/
│   ├── admin/             # Admin-only pages
│   ├── faculty/           # Faculty-only pages
│   ├── student/           # Student-only pages
│   └── shared/            # Cross-role pages
├── types/                 # TypeScript definitions
└── styles/                # Global CSS
```

## License

MIT © AIT Education Group
