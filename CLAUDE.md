# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite) with hot reload on localhost:5173
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint code linting
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests with Vitest
- `npm start` - Start development server in production mode (for deployment)

## Required Environment Variables

Create a `.env` file with these variables:

- `VITE_TAPIS_API_BASE_URL` - Base URL for Tapis API
- `VITE_CKAN_BASE_URL` - Base URL for CKAN instance
- `VITE_MAX_FILE_SIZE` - Maximum file size in bytes (default: 52428800 for 50MB)
- `VITE_DYNAMO_API_BASE_URL` - Base URL for DYNAMO Ensemble Manager API (default: http://localhost:3000/v1)
- `VITE_DYNAMO_DASHBOARD_URL` - Base URL for DYNAMO Dashboard (default: https://dashboard.dynamo.mint.edu)

## Architecture Overview

This is a React + TypeScript application for capturing and displaying stories with resource management capabilities.

### Core Technologies

- **Frontend**: React 18 with TypeScript, Vite build tool
- **Routing**: React Router v5 (react-router-dom)
- **State Management**: React Context + TanStack Query for server state
- **Styling**: TailwindCSS
- **Testing**: Vitest with jsdom environment
- **APIs**: Integrates with Tapis API and CKAN for resource management

### Key Application Structure

**Authentication Flow**:

- Uses `AuthContext` and `AuthProvider` for authentication state
- JWT tokens stored in localStorage
- `ProtectedRoute` component guards authenticated routes
- Login handled via Tapis API integration

**Main Routing Structure**:

- `/` - Stories list (protected)
- `/login` - Authentication
- `/stories/*` - Story management routes (protected)
- `/transcription-editor` - Transcription editing interface (protected)

**Story Management**:

- Stories are backed by CKAN datasets
- `StoryContext` provides story state management
- Resources (files) can be uploaded and managed within stories
- Supports file formats: PDF, DOC, XLS, CSV, JPG, PNG

**Resource Management**:

- File upload via CKAN API (`useCreateResource` hook)
- Resource panel with preview/embed functionality
- File size validation against `VITE_MAX_FILE_SIZE`

### Important Patterns

**Custom Hooks**:

- `useAuth()` - Authentication state and methods
- `useStory()` - Story context within story pages
- `useCreateResource()` - Resource creation with file upload
- `useDetailDataset()` - Fetch CKAN dataset details

**Component Organization**:

- `src/app/` - Main application components organized by feature
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom hooks organized by domain (auth, ckan)
- `src/contexts/` - React contexts for global state
- `src/types/` - TypeScript type definitions

**API Integration**:

- Dynamo API for Analysis workflows
- Tapis API for authentication
- CKAN API for dataset/resource management
- Environment-based URL configuration
- FormData for file uploads

### File Upload System

The application has a comprehensive file upload system:

- Drag-and-drop interface in `AddResourceModal`
- File validation (type and size)
- Progress tracking during uploads
- Integration with CKAN resource creation API
- Support for multiple file uploads

When working with file uploads, always check the `VITE_MAX_FILE_SIZE` environment variable and validate file types against the supported formats list.

### Transcription Editor System

The application includes a comprehensive transcription editor for editing audio/video transcription results:

**Key Components**:

- `TranscriptionEditor` - Main editor component with media player integration
- `Editor` component - Handles transcription segment editing
- `Sidebar` component - Media player controls and resource selection
- `AnnotationModal` - For adding annotations to transcription segments

**Editor Features**:

- Time-synchronized playback with transcription segments
- Segment splitting and merging capabilities
- Text editing with intelligent text splitting
- Speaker identification and editing
- Annotation system for segments
- Auto-save functionality
- Media player controls integrated with editing interface

**Navigation**:

- Access via "Edit Transcription" button on transcription resources
- Uses React Router state to pass resource data
- Breadcrumb navigation back to story context

### Analysis Workflow System (TapisApp Integration)

The application includes an integrated analysis workflow system powered by DYNAMO Ensemble Manager, which runs TapisApps encapsulated as DynamoModels:

**Architecture Overview**:

- **TapisApps** - Computational applications (transcription, narrative analysis, topic classification) deployed on TAPIS infrastructure
- **DynamoModels** - DYNAMO's encapsulation of TapisApps with model configurations and parameters
- **Analysis Workflows** - UI-driven processes that configure and execute DynamoModels through DYNAMO API

**Key Components**:

- `TranscriptionModal` - Multi-step modal for configuring and starting analysis workflows
- `useTranscription` hook - Manages analysis workflow and API calls (currently supports transcription, extensible for other analyses)
- `dynamoApiService` - API service for DYNAMO Ensemble Manager communication with TapisApp/DynamoModel system

**Analysis Workflow Process**:

1. **Analysis Type Selection** - Choose from available TapisApps encapsulated as DynamoModels (Audio/Video Transcription, Narrative Analysis, Topic Classification)
2. **Problem Statement Management** - Select existing or create new problem statements with region and time period
3. **Task/Subtask Configuration** - Configure task and subtask names for the analysis
4. **Model Setup** - Configure the selected DynamoModel with resource data and parameters
5. **Submission** - Submit the analysis job to DYNAMO for TapisApp execution
6. **Results** - View submission confirmation and links to DYNAMO dashboard for monitoring

**TapisApp/DynamoModel Integration**:

- Each analysis type corresponds to a specific TapisApp deployed on TAPIS infrastructure
- DynamoModels encapsulate TapisApps with their configuration schemas and parameter definitions
- DYNAMO API orchestrates the execution of TapisApps through the DynamoModel abstraction
- Resources with appropriate mimetypes automatically show relevant analysis buttons based on compatible TapisApps

**Current Implementation**:

- **Audio/Video Transcription TapisApp** - Encapsulated as DynamoModel for whisper-based transcription
- Default model ID: `7c2c8d5f-322b-4c1c-8a85-2c49580eadde`
- Supports both audio and video file transcription
- Supports Texas and Alaska regions

**Extension Points for Additional TapisApps**:

- Narrative Analysis TapisApp (planned)
- Topic Classification TapisApp (planned)  
- Custom analysis TapisApps can be integrated by adding configurations to `ANALYSIS_TYPES` in `services/dynamoApi.ts`

## Important Development Notes

**Environment Configuration**:

- The Vite config validates required environment variables at build time
- `VITE_TAPIS_API_BASE_URL`, `VITE_CKAN_BASE_URL`, and `VITE_MAX_FILE_SIZE` are mandatory
- DYNAMO variables are optional but required for transcription features

**Testing Setup**:

- Uses Vitest with jsdom environment for component testing
- Global test configuration in `vitest.config.ts` with globals enabled
- React Testing Library patterns recommended for component tests
- Test files located in `src/` directory alongside source code (e.g., `src/utils/textSplitting.test.ts`)
- Run single test file: `npm test -- textSplitting.test.ts`

**Code Organization**:

- Feature-based organization in `src/app/` directory
- Shared components in `src/components/`
- Domain-specific hooks in `src/hooks/` (auth, ckan)
- Type definitions centralized in `src/types/`
- Utility functions in `src/utils/` with accompanying tests

**Authentication Flow**:

- JWT tokens managed via `AuthContext` and stored in localStorage
- `useAccessToken` hook provides token access throughout the app
- CKAN API requests require Bearer token authentication
- Tapis integration for initial authentication

**State Management Patterns**:

- React Context for authentication and story-level state
- TanStack Query for server state management and caching
- Local state for UI-specific concerns
- Custom hooks abstract complex state logic
- Remember that Stories is a CKAN Dataset

## Development Workflow

**When making changes:**

1. Always run `npm run lint` and `npm run build` before committing to ensure code quality
2. Test changes with `npm run test` to verify functionality
3. Use the existing patterns and conventions found in the codebase
4. Stories are backed by CKAN datasets - understand this relationship when working with story-related features

**File Structure Conventions:**

- Components organized by feature in `src/app/`
- Shared/reusable components in `src/components/`
- Custom hooks grouped by domain in `src/hooks/` (e.g., `hooks/auth/`, `hooks/ckan/`)
- API services in `src/services/`
- TypeScript types centralized in `src/types/`
- Test files co-located with source files using `.test.ts` extension

**Code Style:**

- React functional components with TypeScript
- Custom hooks for complex logic abstraction
- TanStack Query for server state management
- React Context for app-level state (auth, story context)
- Environment variables prefixed with `VITE_` for Vite bundling
