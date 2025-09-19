# Replit.md - Hostel Management System

## Overview

This is a full-stack hostel management system built with React, Express.js, and PostgreSQL. The application provides comprehensive management capabilities for hostel operations including student management, room allocation, payment tracking, and financial reporting. It features a modern web interface with multilingual support (English and Bengali) and uses Replit's authentication system for secure access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern component patterns
- **Vite** as the build tool and development server for fast hot module replacement
- **ShadCN UI** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with CSS custom properties for theming
- **TanStack Query** for server state management, caching, and data synchronization
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form management
- **i18next** for internationalization supporting English and Bengali languages

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **Drizzle ORM** for type-safe database operations and schema management
- **PostgreSQL** with Neon serverless database for data persistence
- RESTful API design with centralized error handling and request logging
- Session-based authentication using PostgreSQL session storage

### Authentication & Authorization
- **Replit Auth** integration using OpenID Connect (OIDC) for secure authentication
- **Passport.js** strategy for handling authentication flows
- Session management with PostgreSQL storage using connect-pg-simple
- Protected API routes with authentication middleware

### Database Design
- **Users table** for authentication and profile management
- **Floors and Rooms** for hierarchical hostel structure management
- **Students table** with foreign key relationships to rooms
- **Payments table** for financial transaction tracking
- **Expenses table** for hostel operational costs
- **Activity logs** for audit trail and system transparency
- **Alerts table** for notification and warning management
- **Sessions table** for secure session storage

### State Management Pattern
- Server state managed by TanStack Query with automatic caching and refetching
- Local UI state managed by React hooks and component state
- Global authentication state accessible through custom useAuth hook
- Form state isolated using React Hook Form

### UI/UX Architecture
- Responsive design with mobile-first approach
- Dark/light theme support through CSS custom properties
- Component composition pattern using Radix UI primitives
- Consistent design system with centralized theme configuration
- Loading states and error boundaries for improved user experience

### Build & Deployment
- **Vite** configuration optimized for client-side builds
- **esbuild** for efficient server-side bundling
- Development and production environment configurations
- TypeScript compilation with strict type checking

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless** - Serverless PostgreSQL database connection
- **drizzle-orm** and **drizzle-kit** - Type-safe ORM and migration toolkit
- **@tanstack/react-query** - Server state management and caching
- **express** and **express-session** - Web framework and session management

### Authentication & Security
- **openid-client** - OpenID Connect client for Replit authentication
- **passport** - Authentication middleware framework
- **connect-pg-simple** - PostgreSQL session store

### UI Component Libraries
- **@radix-ui/* packages** - Accessible UI primitives (30+ component packages)
- **lucide-react** - Feather-based icon library
- **class-variance-authority** and **clsx** - Conditional styling utilities

### Form Management & Validation
- **react-hook-form** and **@hookform/resolvers** - Form handling
- **zod** and **drizzle-zod** - Schema validation and type inference

### Internationalization & Utilities
- **i18next** and **react-i18next** - Internationalization framework
- **date-fns** - Date manipulation and formatting utilities
- **memoizee** - Function memoization for performance optimization

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting
- **@replit/vite-plugin-cartographer** - Development tooling for Replit environment

### Styling & Theming
- **tailwindcss** - Utility-first CSS framework
- **postcss** and **autoprefixer** - CSS processing pipeline
- Custom CSS properties for dynamic theming support