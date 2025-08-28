# HR Management System (Sistema RRHH)

## Project Overview
This is a comprehensive Human Resources Management System (Sistema RRHH) migrated from Lovable to Replit. The application is designed for Venezuelan companies and includes complete HR functionality with Spanish interface.

## Architecture
- **Frontend**: React with TypeScript, Vite
- **Backend**: Express.js with TypeScript  
- **Routing**: React Router DOM (migrated from wouter)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Storage**: In-memory storage with interface for future database integration

## Modules
1. **Dashboard** - Executive summary and key HR metrics
2. **Employees Module** - Complete employee management and records
3. **Contracts Module** - Labor contract management (Venezuelan legislation)
4. **Probation Module** - Probation period tracking and evaluations
5. **Departures Module** - Exit process and settlements management
6. **Auth Module** - Authentication and role-based access control

## Key Features
- Spanish language interface tailored for Venezuelan HR practices
- Role-based access control (6 hierarchical levels)
- Contract management following Venezuelan labor law
- Probation period tracking with evaluation workflows
- Complete departure/exit processing
- Real-time dashboard with KPIs

## Migration Notes
- Successfully migrated from Lovable to Replit environment
- Updated dependencies (react-router-dom, sonner)
- Preserved existing React Router DOM routing structure
- All UI components and functionality intact
- Server running on port 5000 as required by Replit

## User Preferences
- Spanish language interface preferred
- Venezuelan labor law compliance required
- Clean, professional UI with consistent branding

## Database Schema
Complete database structure with Spanish naming convention:
- **Usuarios y Roles**: Authentication and role-based access control
- **Empleados**: Employee management with Venezuelan identification system
- **Departamentos y Cargos**: Organizational structure and job positions
- **Contratos**: Labor contracts following Venezuelan legislation 
- **Períodos de Prueba**: Probation period tracking and evaluations
- **Egresos**: Exit process and settlements management

## Backend Architecture
- **Storage**: In-memory implementation with interface for future database migration
- **API Routes**: Complete REST API with Spanish endpoints
- **Security**: Input validation with Zod schemas
- **Data Integrity**: Audit fields and relationship constraints

## Recent Changes
- 2024-12-28: Migrated from Lovable to Replit
- Installed missing dependencies: react-router-dom, sonner
- Verified application runs successfully on Replit infrastructure
- 2024-12-28: Developed complete database schema with Spanish names
- Implemented comprehensive in-memory storage system
- Created full REST API with all CRUD operations
- Added client-side API utilities for frontend integration