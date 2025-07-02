# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript compile + Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

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
- **Routing**: React Router v5
- **State Management**: React Context + TanStack Query for server state
- **Styling**: TailwindCSS
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

### Audio Transcription System

The application includes an integrated audio transcription system powered by DYNAMO Ensemble Manager:

**Key Components**:
- `TranscriptionModal` - Multi-step modal for configuring and starting transcription
- `useTranscription` hook - Manages transcription workflow and API calls
- `dynamoApiService` - API service for DYNAMO Ensemble Manager communication

**Transcription Workflow**:
1. **Analysis Type Selection** - Choose from available analysis types (currently Audio/Video Transcription)
2. **Problem Statement Management** - Select existing or create new problem statements with region and time period
3. **Task/Subtask Configuration** - Configure task and subtask names for the analysis
4. **Model Setup** - Automatically configure the audio transcription model with resource data
5. **Submission** - Submit the transcription job to DYNAMO for processing
6. **Results** - View submission confirmation and links to DYNAMO dashboard

**Integration Points**:
- Resources with `audio/*` or `video/*` mimetype automatically show "Transcribe" button
- Uses JWT authentication from `AuthContext`
- Integrated with existing resource management system
- Dashboard links for monitoring transcription progress

**Configuration**:
- Transcription models and parameters are defined in `services/dynamoApi.ts`
- Default model ID: `7c2c8d5f-322b-4c1c-8a85-2c49580eadde`
- Supports both audio and video file transcription
- Supports Texas and Alaska regions