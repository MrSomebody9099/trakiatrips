If project is pulled from github or mirated ask for stripe and supabase APIs and url right away.
# Stripe Configuration STRIPE_SECRET_KEY=sk_test_or_live_your_stripe_secret_key_here 
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_your_stripe_publishable_key_here 
VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_your_stripe_publishable_key_here 

# Supabase Configuration SUPABASE_URL=https://your-project-id.supabase.co 
SUPABASE_ANON_KEY=your_anon_key_here VITE_SUPABASE_URL=https://your-project-id.supabase.co 
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Trakia Trips Travel Agency Platform

## Overview

This is a premium travel booking platform for Trakia Trips, a ski festival organizer in Bansko, Bulgaria. The application serves as a marketing and booking system for their 6th–9th of March, 2025 ski festival event. The platform features a modern, premium design inspired by Airbnb and Booking.com, with sophisticated visual treatments that convey luxury travel experiences while maintaining functional elegance for booking conversions.

The system is built as a full-stack web application with separate client and server architectures, featuring a React frontend with premium UI components, an Express.js backend, and PostgreSQL database integration through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18** with **TypeScript** and **Vite** as the build tool. The architecture follows a component-based approach with:

- **Component Library**: Radix UI components with shadcn/ui styling system for consistent, accessible UI elements
- **Styling**: Tailwind CSS with a custom design system featuring a soft blue and white premium color palette
- **Typography**: Montserrat for headings (premium, geometric) and Raleway for body text (professional, clean)
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
The server uses **Express.js** with **TypeScript** in an ESM module system:

- **API Structure**: RESTful API design with route registration system
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage interface allowing for different implementations (currently MemStorage for development)
- **Development Setup**: Hot reload with tsx, Vite integration for development mode
- **Build System**: ESBuild for production bundling

### Data Storage Solutions
**Database**: PostgreSQL with Neon Database serverless connection for cloud deployment
**ORM**: Drizzle ORM provides type-safe database schema definitions and migrations
**Schema Design**: Currently includes basic user authentication schema with plans for booking and trip management tables
**Session Management**: connect-pg-simple for PostgreSQL-backed session storage

### Authentication and Authorization
The application implements a multi-modal authentication system:
- **Email Collection**: Primary method for lead generation and user engagement
- **Modal Authentication**: Time-delayed auth panel (5 seconds) for user signup/signin
- **Admin Dashboard**: Password-protected admin interface for booking management
- **Local Storage**: Client-side storage for user preferences and auth state

### Component Design System
**Premium Design Principles**:
- Glass morphism effects with subtle blue tints and backdrop blur
- Sophisticated animations and hover states using CSS transforms
- Consistent spacing using Tailwind's 4, 8, 12, 16 unit system
- Premium color palette with soft blues (210 45% 25% primary, 210 35% 45% secondary)
- Professional typography hierarchy with specific font weights and sizes

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm** and **drizzle-kit**: Type-safe database ORM and migration tools
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **express**: Node.js web application framework
- **react-hook-form**: Form state management and validation

### UI and Design Dependencies
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown-menu, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe component variant management
- **clsx**: Conditional CSS class utility
- **lucide-react**: Modern icon library

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety and developer experience
- **tsx**: TypeScript execution for Node.js development
- **esbuild**: Fast JavaScript bundler for production builds

### Media and Assets
- **embla-carousel-react**: Touch-friendly carousel component for gallery displays
- Custom video and image assets stored in attached_assets directory for marketing content

### External Services Integration
- **Instagram Integration**: Social media links to @trakiatrips for brand engagement
- **Google Fonts**: Web font loading for Montserrat and Raleway typography
- **Replit Environment**: Development environment integration with cartographer and runtime error overlays

The architecture prioritizes premium user experience, type safety, and scalable development practices while maintaining clean separation of concerns between frontend presentation, backend logic, and data persistence layers.
