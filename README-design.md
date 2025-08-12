# Stories Interface Architecture Design

This document describes the user workflow and system architecture for the Stories Interface application, a React-based platform for capturing and displaying stories with integrated resource management capabilities.

## System Overview

The Stories Interface enables users to create and manage stories by uploading and organizing various media resources including audio files, documents, and images. The system integrates with Tapis authentication and CKAN for dataset management.

## User Workflow Diagram

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   participant User
   participant SI as Stories Interface
   participant TA as Tapis Auth
   participant API as CKAN API
   participant CKAN as CKAN System

   %% Authentication Flow
   rect rgb(230, 245, 255)
    Note over User,TA: Phase 1: Authentication
    User->>TA: Login with credentials
    TA->>TA: Verify credentials
    TA->>SI: Authentication token
    SI-->>User: Authentication successful

    %% Create New Story
    Note over User,API: Phase 2: Story Selection
    User->>SI: Request story list
    SI->>API: Fetch story list
    rect  rgb(230,245,255)
    Note over API,CKAN: Authorization process
    API->>CKAN: Verify authentication token
    CKAN-->>API: Token valid
    end
    API-->>SI: Return list of stories
    SI-->>User: Return list of stories
    User->>SI: Select an existing story
    SI->>API: Fetch story details
     API<<->>CKAN: Authentication validation

    API-->>SI: Return story details
    SI-->>User: Display story editor

   Note over User,API: Phase 3: Resource Addition
   %% Add Audio Interview Resource
   User->>SI: Click "Add Resource" button
   SI-->>User: Display resource upload dialog
   User->>SI: Select audio file from device
   User->>SI: Submit resource upload
   SI->>API: Create new resource in dataset
   %% Resource Upload Process
     API<<->>CKAN: Authentication validation

   API->>CKAN: Upload file with metadata to story dataset
   CKAN->>CKAN: Store file and process metadata
   CKAN-->>API: Return resource ID and URL
   API-->>SI: Confirm resource creation

   %% Embed Resource in Story
   SI-->>User: Display resource in resource panel

  end
```

## Workflow Description

This sequence diagram illustrates the complete user journey through the Stories Interface application across three distinct phases:

### Phase 1: Authentication
- **User Authentication**: Users authenticate through the Tapis authentication system using their credentials
- **Token Management**: Upon successful verification, Tapis provides an authentication token to the Stories Interface
- **Session Establishment**: The interface confirms authentication success, enabling access to protected features

### Phase 2: Story Selection and Management  
- **Story Discovery**: Users can browse and request lists of available stories from the system
- **Authorization Validation**: The CKAN API validates authentication tokens with the CKAN System for each request
- **Story Access**: Users select existing stories and access the story editor interface with full story details

### Phase 3: Resource Addition and Integration
- **Resource Upload Interface**: Users access the resource addition dialog to upload various file types
- **File Processing**: The system handles file uploads including audio interviews, documents, and media files
- **Metadata Management**: CKAN processes uploaded files, generates metadata, and stores resources with unique identifiers
- **Resource Integration**: Successfully uploaded resources appear in the resource panel for embedding within stories

## Key System Components

- **Stories Interface**: React-based frontend application with TypeScript
- **Tapis Auth**: Authentication service managing user credentials and JWT tokens
- **CKAN API**: RESTful API handling dataset and resource management operations
- **CKAN System**: Backend data management system storing files, metadata, and story datasets

## Security and Authentication

The system implements comprehensive authentication validation at each API interaction, ensuring secure access to stories and resources. JWT tokens are validated consistently across all CKAN operations, maintaining data integrity and user access controls.

## Audio Transcription Workflow

The transcription system integrates with DYNAMO Ensemble Manager to provide automated audio/video transcription capabilities. Below is the detailed workflow sequence:

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   participant User
   participant TC as TranscriptionModal
   participant Hook as useTranscription
   participant API as DynamoApiService
   participant DYNAMO as DYNAMO System
   participant Poll as ExecutionPolling

   %% Phase 1: Initialization
   rect rgb(255, 245, 230)
   Note over User,Hook: Phase 1: Setup & Configuration
   User->>TC: Click "Transcribe" on audio resource
   TC->>Hook: Initialize transcription hook
   Hook->>API: Fetch problem statements
   API->>DYNAMO: GET /problem-statements
   DYNAMO-->>API: Return available problem statements
   API-->>Hook: Problem statements list
   Hook-->>TC: Display analysis types & problem statements
   TC-->>User: Show configuration modal
   end

   %% Phase 2: Configuration
   rect rgb(230, 255, 245)
   Note over User,API: Phase 2: Problem Statement & Task Setup
   User->>TC: Select/create problem statement
   alt Create New Problem Statement
       TC->>Hook: Create problem statement
       Hook->>API: Create problem statement
       API->>DYNAMO: POST /problem-statements
       DYNAMO-->>API: New problem statement created
       API-->>Hook: Problem statement ID
   else Use Existing
       User->>TC: Select existing problem statement
   end
   
   User->>TC: Configure task/subtask names
   User->>TC: Submit transcription request
   TC->>Hook: Start transcription with config
   end

   %% Phase 3: Transcription Execution
   rect rgb(245, 230, 255)
   Note over Hook,DYNAMO: Phase 3: Task Creation & Model Setup
   
   Hook->>Hook: Initialize progress steps
   Hook->>Hook: Update step 1 status (active)
   
   Hook->>API: Check for existing task
   API->>DYNAMO: GET /tasks (filter by dataset)
   DYNAMO-->>API: Existing task or null
   API-->>Hook: Task existence result
   
   alt Existing Task Found
       Hook->>API: Create subtask only
       API->>DYNAMO: POST /subtasks
   else No Existing Task
       Hook->>API: Create new task
       API->>DYNAMO: POST /tasks
       DYNAMO-->>API: New task created
       API-->>Hook: Task ID
       Hook->>API: Create subtask
       API->>DYNAMO: POST /subtasks
   end
   
   DYNAMO-->>API: Subtask created
   API-->>Hook: Task & Subtask IDs
   Hook->>Hook: Update step 1 (completed)
   
   Hook->>Hook: Update step 2 status (active)
   Hook->>API: Setup model configuration
   API->>DYNAMO: POST /model-configuration
   Note over API,DYNAMO: Configure audio transcription model with resource data
   DYNAMO-->>API: Configuration confirmed
   API-->>Hook: Model setup complete
   Hook->>Hook: Update step 2 (completed)
   end

   %% Phase 4: Submission & Monitoring
   rect rgb(230, 245, 255)
   Note over Hook,Poll: Phase 4: Analysis Submission & Monitoring
   
   Hook->>Hook: Update step 3 status (active)
   Hook->>API: Submit subtask for execution
   API->>DYNAMO: POST /submit-subtask
   DYNAMO->>DYNAMO: Queue transcription job
   DYNAMO-->>API: Submission confirmed
   API-->>Hook: Execution started
   Hook->>Hook: Update step 3 (completed)
   
   Hook->>Poll: Initialize execution polling
   Hook->>Hook: Set current result with dashboard URL
   Hook-->>TC: Return transcription result
   TC-->>User: Show success with dashboard link
   
   loop Execution Monitoring
       Poll->>API: Check execution status
       API->>DYNAMO: GET /execution-status
       DYNAMO-->>API: Current execution state
       API-->>Poll: Execution progress
       alt Execution Complete
           Poll->>Hook: Notify completion
           Hook-->>TC: Update status (complete)
       else Execution Failed
           Poll->>Hook: Notify failure
           Hook-->>TC: Update status (error)
       else Still Running
           Poll->>Poll: Continue polling
       end
   end
   end
```

### Transcription Process Breakdown

**Phase 1: Setup & Configuration**
- User initiates transcription from audio/video resource
- System fetches available problem statements and analysis types
- Configuration modal displays options for user selection

**Phase 2: Problem Statement & Task Setup**
- User selects or creates problem statements with regional and temporal scope
- Task and subtask names are configured for organizational purposes
- Transcription request is submitted with complete configuration

**Phase 3: Task Creation & Model Setup**
- System checks for existing tasks to avoid duplication
- Creates new tasks/subtasks as needed in DYNAMO system
- Configures audio transcription model with specific resource data and metadata

**Phase 4: Analysis Submission & Monitoring**
- Subtask is submitted to DYNAMO for execution
- Background polling monitors transcription progress
- Users receive dashboard links for real-time status monitoring
- System handles completion, failure, and ongoing execution states

The transcription system provides comprehensive error handling, progress tracking, and integration with the DYNAMO dashboard for advanced monitoring capabilities.
