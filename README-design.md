# Stories Interface Architecture Design

This document describes the user workflow and system architecture for the Stories Interface application, a React-based platform for capturing and displaying stories with integrated resource management capabilities.

## Entity Relationship Diagram

The Stories Explorer platform bridges the gap between technical data management and narrative storytelling by enabling users to create rich, multimedia stories that incorporate scientific datasets, geographic information, and media resources. The platform serves researchers, communities, and decision-makers who need to communicate complex information in accessible formats while maintaining proper data stewardship.

### Key Components

- **CKAN**: The open-source data management system that serves as the backend for storing, managing, and distributing datasets and resources. CKAN provides APIs for data access, search, and organization.
- **Stories Interface**: The user-facing application that allows for the creation, editing, and viewing of narrative content that incorporates data resources. Stories are stored as specialized datasets in CKAN.
- **Stories**: A specialized dataset type in CKAN used to store story content, including text, embedded media, and references to other resources. **Note**: [Schema definition is currently undefined and needs to be implemented](https://github.com/In-For-Disaster-Analytics/stories-ui/issues/15).

```mermaid
erDiagram
   classDef ckanConcepts fill:#e6f7ff,stroke:#0099cc,stroke-width:1px
   classDef storiesConcepts fill:#f9f0ff,stroke:#9933cc,stroke-width:1px


   DATASET ||--o{ RESOURCE : "has"
   DATASET {
       string id
       string title
       string description
       date created
       date modified
       string owner
       string tags
       point location
   }

   STORY ||--o{ RESOURCE : "has"
   STORY {
       string id
       string title
       string content
       string narrative
       date created
       date modified
       string author
       point location
       string tags
   }

   RESOURCE {
       string id
       string name
       string resource_type
       string format
       string url
       blob data
       string description
   }

   USER ||--o{ DATASET : "owns"
   USER ||--o{ STORY : "authors"
   USER {
       string id
       string username
       string email
       string roles
   }

   %% CKAN Implementation Mapping
   DATASET ||--|{ PACKAGE : "implemented as"
   STORY ||--|{ DATASET : "implemented as"

   PACKAGE {
       string name
       string title
       string type
       string extras
   }

```

## System Overview

The Stories Interface enables users to create and manage stories by uploading and organizing various media resources including audio files, documents, and images. The system integrates with Tapis authentication and CKAN for dataset management.

## Stories retrieval and resources creation

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
    rect  rgba(125, 240, 241, 1)
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

## Audio Transcription Workflow

The transcription system integrates with DYNAMO Ensemble Manager to provide automated audio/video transcription capabilities. The workflow is broken down into four main phases, each represented by separate sequence diagrams:

### Phase 1: List problem statements and analysis types

- Stories UI fetches available problem statements and analysis types

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   participant User
   participant TU as Stories UI
   participant API as DynamoApiService
   participant DYNAMO as DYNAMO System

   rect rgb(230, 245, 255)
   User->>TU: Click "Transcribe" on audio resource
   TU->>API: Fetch problem statements
   API->>DYNAMO: GET /problem-statements
   DYNAMO-->>API: Return available problem statements
   API-->>TU: Problem statements list
   TU-->>User: Show configuration modal with analysis types
   end
```

### Phase 2: Problem Statement & Task Setup

- User selects or creates problem statements with regional and temporal scope

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   rect rgb(230, 245, 255)
   participant User
   participant TU as Stories UI
   participant API as DynamoApiService
   participant DYNAMO as DYNAMO System

   User->>TU: Select/create problem statement
   alt Create New Problem Statement
       TU->>API: Create problem statement
       API->>DYNAMO: POST /problem-statements
       DYNAMO-->>API: New problem statement created
       API-->>TU: Problem statement ID
   else Use Existing
       User->>TU: Select existing problem statement
   end

   end
```

### Phase 3: Task Creation & Model Setup

- Stories UI checks for existing tasks to avoid duplication
- Creates new tasks/subtasks as needed in DYNAMO system
- Configures audio transcription model with specific resource data

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   rect rgb(230, 245, 255)
   participant TU as Stories UI
   participant API as DynamoApiService
   participant DYNAMO as DYNAMO System

   TU->>TU: Initialize progress steps
   TU->>TU: Update step 1 status (active)

   TU->>API: Check for existing task
   API->>DYNAMO: GET /tasks (filter by dataset)
   DYNAMO-->>API: Existing task or null
   API-->>TU: Task existence result

   alt Existing Task Found
       TU->>API: Create subtask only
       API->>DYNAMO: POST /subtasks
   else No Existing Task
       TU->>API: Create new task
       API->>DYNAMO: POST /tasks
       DYNAMO-->>API: New task created
       API-->>TU: Task ID
       TU->>API: Create subtask
       API->>DYNAMO: POST /subtasks
   end

   DYNAMO-->>API: Subtask created
   API-->>TU: Task & Subtask IDs
   TU->>TU: Update step 1 (completed)

   TU->>TU: Update step 2 status (active)
   TU->>API: Setup model configuration
   API->>DYNAMO: POST /model-configuration
   Note over API,DYNAMO: Configure audio transcription model with resource data
   DYNAMO-->>API: Configuration confirmed
   API-->>TU: Model setup complete
   TU->>TU: Update step 2 (completed)
   end
```

### Phase 4: Analysis Submission & Monitoring

- Subtask is submitted to DYNAMO for execution
- ExecutionPolling component monitors transcription progress in background
- Users receive dashboard links for real-time status monitoring
- System handles completion, failure, and ongoing execution states

The unified transcription interface combines modal UI with the useTranscription hook logic, providing comprehensive error handling, progress tracking, and integration with the DYNAMO dashboard for advanced monitoring capabilities.

```mermaid
%%{ init : { "theme" : "neutral", "themeVariables" : { "primaryColor" : "#fff", "primaryTextColor" : "#000", "primaryBorderColor" : "#000", "lineColor" : "#000", "secondaryColor" : "#f8f8f8", "tertiaryColor" : "#f0f0f0" }}}%%
sequenceDiagram
   rect rgb(230, 245, 255)
   participant User
   participant TU as Stories UI
   participant Poll as ExecutionPolling
   participant API as DYNAMO API
   participant TAPIS as TAPIS Service

   TU->>TU: Update step 3 status (active)
   TU->>API: Submit subtask for execution  POST /submit-subtask
   API->>TAPIS: Queue transcription job
   TAPIS-->>API: Job ID
   API-->>TU: Execution started
   TU->>TU: Update step 3 (completed)

   TU->>Poll: Initialize execution polling
   TU->>TU: Set current result with dashboard URL
   TU-->>User: Show success with dashboard link

   loop Execution Monitoring
       Poll->>API: Check execution status
       API->>TAPIS: Get job status
       TAPIS-->>API: Current execution state
       API-->>Poll: Execution progress
       alt Execution Complete
           Poll->>TU: Notify completion
           TU-->>User: Update status (complete)
       else Execution Failed
           Poll->>TU: Notify failure
           TU-->>User: Update status (error)
       else Still Running
           Poll->>Poll: Continue polling
       end
   end
   end
```
