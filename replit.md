
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
- Probation period tracking with evaluation workflows (30-day period)
- Complete departure/exit processing
- Real-time dashboard with KPIs
- **Bidirectional synchronization between Employee and Contract modules**
- Current date display in Venezuelan format ("dd de MM de AAAA")
- Historical view of employee contracts with expandable interface
- Automatic contract termination when creating new contracts
- Contract creation with position changes and salary adjustments
- Multiple contract types and reasons (New Hire, Promotion, Transfer, etc.)

## Data Synchronization
The system maintains bidirectional synchronization between the Employee and Contract modules:

- **Employee → Contract**: When employee information is updated (salary, position, start date), the active contract is automatically synchronized
- **Contract → Employee**: When a contract is updated or created, the employee's information is automatically updated to reflect current contract details
- **Real-time updates**: Both modules invalidate their respective caches to ensure data consistency across the application

## Recent Development Session Changes

### Date Display Enhancement
- Added current date display in Venezuelan format in the header
- Positioned below the "OnBoard HHRR Venezuela" logo
- Uses Spanish month names and format "dd de MM de AAAA"

### Contract Module Enhancements
- **Contract Creation & Management**: Full CRUD implementation for labor contracts
- **Historical View**: Default view showing contract history grouped by employee
- **Multiple Contracts**: Support for employees having multiple contracts over time
- **Automatic Contract Termination**: Previous active contracts are automatically terminated when new ones are created
- **Contract Reasons**: Added support for different contract reasons (New Hire, Promotion, Salary Increase, Transfer, etc.)
- **Position Management**: Contracts can include position changes with automatic employee record updates
- **Date Formatting Fix**: Resolved timezone issues causing date display discrepancies

### Employee Module Integration
- **Enhanced KPI Cards**: Updated to show proper active employee counts and probation period alerts
- **Probation Period Tracking**: 30-day probation periods with alerts for periods ending within 7 days
- **Department Distribution**: Real-time employee distribution by department
- **Recent Hires by Department**: Shows new hires in the last month/quarter by department

### Data Synchronization Implementation
- **Bidirectional Sync**: Employee and contract data automatically synchronize when either is updated
- **Cache Invalidation**: Query caches are properly invalidated to ensure UI consistency
- **Real-time Updates**: Changes in one module immediately reflect in the other

### Backend Improvements
- Enhanced contract creation logic with automatic previous contract termination
- Improved date handling to prevent timezone-related display issues
- Added comprehensive synchronization between employee and contract data
- Better error handling and logging for debugging

---

## CHANGELOG

### [2024-12-19] - Major Synchronization and Contract Management Update

#### Added
- **Bidirectional Data Synchronization**: Implemented automatic synchronization between Employee and Contract modules
- **Contract Historical View**: Default view showing complete contract history per employee
- **Multiple Contract Support**: Employees can have multiple contracts with automatic previous contract termination
- **Contract Reasons**: Added support for various contract creation reasons (New Hire, Promotion, Transfer, Salary Increase, etc.)
- **Position Management in Contracts**: Contracts can include position changes with automatic employee record updates
- **Current Date Display**: Added Venezuelan format date display in application header
- **Probation Period Enhancements**: 30-day probation periods with 7-day termination alerts

#### Fixed
- **Date Display Issues**: Resolved timezone-related problems causing dates to show one day earlier
- **Contract Date Synchronization**: Initial contract dates now properly match employee start dates
- **Cache Invalidation**: Proper query cache management for real-time data consistency

#### Changed
- **Default Contract View**: Changed to historical view as default in Contract module
- **Employee KPI Cards**: Enhanced with more accurate active employee counts and probation alerts
- **Contract Creation Flow**: Improved with automatic previous contract termination and employee synchronization

#### Technical Improvements
- Enhanced backend synchronization logic in routes.ts
- Improved error handling and logging for debugging
- Better date formatting functions to prevent timezone issues
- Comprehensive cache invalidation strategy for both modules

---

## Development Notes
- All employee status calculations exclude "Inactive" employees from active counts
- Probation periods are calculated as 30 days from employee start date
- Contract creation automatically handles previous active contract termination
- Data synchronization is handled server-side with proper error handling
- UI updates are managed through TanStack Query cache invalidation
