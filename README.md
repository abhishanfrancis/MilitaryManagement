# Military Asset Management System (MMS)

A full-stack web application for managing military assets, tracking movements, assignments, and expenditures across multiple bases with role-based access control.

## Overview

The Military Asset Management System enables commanders and logistics personnel to manage the movement, assignment, and expenditure of critical assets (vehicles, weapons, ammunition, etc.) across multiple military bases. It provides transparency, streamlines logistics, and ensures accountability through a secure, role-based solution.

## Features

- **Dashboard** — Key metrics: Opening/Closing Balance, Net Movement, Assigned & Expended assets with date, base, and equipment filters
- **Asset Management** — Track inventory across multiple bases with real-time balance monitoring
- **Purchases** — Record and track purchases with status workflow (Ordered → Delivered / Cancelled)
- **Transfers** — Inter-base asset transfers with approval workflow and full audit trail
- **Assignments & Expenditures** — Assign assets to personnel, track expended assets and returns
- **Equipment Tracking** — Inventory management with maintenance scheduling
- **Mission Management** — Track missions and unit deployments
- **Soldiers & Units** — Personnel and organizational unit management
- **Activity Logging** — Complete audit trail of all system operations

## Role-Based Access Control (RBAC)

| Role | Scope |
|------|-------|
| **Admin** | Full access to all data, operations, and system configuration |
| **Base Commander** | Operational management within assigned base — assignments, expenditures, transfer approvals, mission status updates |
| **Logistics Officer** | Supply chain operations — assets, purchases, transfers, equipment maintenance |

## Tech Stack

### Frontend
- **Next.js 13** (React 18) with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for data fetching
- **Chart.js** for dashboard visualizations
- **Formik + Yup** for form handling and validation
- **Framer Motion** for animations

### Backend
- **Node.js** with **Express.js 5**
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication with bcrypt password hashing
- **Winston** for structured logging

## Project Structure

```
├── MMSFSDAPP/
│   ├── MMS-backend/          # Express.js REST API
│   │   ├── server.js         # Entry point
│   │   ├── middleware/       # Auth, RBAC, logging middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route handlers
│   │   ├── scripts/          # DB seed & utility scripts
│   │   └── utils/            # Logger utilities
│   │
│   └── MMS-frontend/         # Next.js web application
│       └── src/
│           ├── components/   # Reusable UI components
│           ├── contexts/     # Auth & Theme providers
│           ├── pages/        # Next.js pages/routes
│           ├── services/     # API service layer
│           ├── stores/       # Zustand state stores
│           ├── styles/       # Global styles
│           └── types/        # TypeScript type definitions
```

## Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas)

### Backend Setup

```bash
cd MMSFSDAPP/MMS-backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/military_management
JWT_SECRET=your_jwt_secret_key
```

Initialize the database and start the server:
```bash
npm run init-db        # Initialize database
npm run seed           # Seed sample data
npm run dev            # Start with nodemon (development)
```

### Frontend Setup

```bash
cd MMSFSDAPP/MMS-frontend
npm install
npm run dev            # Start on http://localhost:3000
```

### Default Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| commander1 | password123 | Base Commander |
| commander2 | password123 | Base Commander |
| logistics1 | password123 | Logistics Officer |
| logistics2 | password123 | Logistics Officer |

## API Endpoints

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| Auth | `/api/auth/*` | Login, logout, register, profile |
| Dashboard | `/api/dashboard` | Aggregated metrics |
| Assets | `/api/assets/*` | Asset CRUD, base/type filters |
| Purchases | `/api/purchases/*` | Purchase management & delivery |
| Transfers | `/api/transfers/*` | Inter-base transfers & approvals |
| Assignments | `/api/assignments/*` | Asset-to-personnel assignments |
| Expenditures | `/api/expenditures/*` | Asset expenditure tracking |
| Equipment | `/api/equipment/*` | Equipment inventory & maintenance |
| Missions | `/api/missions/*` | Mission management |
| Soldiers | `/api/soldiers/*` | Personnel management |
| Units | `/api/units/*` | Organizational units |
| Bases | `/api/bases/*` | Base management |
| Ranks | `/api/ranks/*` | Rank hierarchy |
| Users | `/api/users/*` | User administration |
| Activity Logs | `/api/activity-logs/*` | Audit trail |

## License

MIT
