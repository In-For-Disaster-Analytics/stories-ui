# Modeler/Data Scientist User Flow

**User Profile**: Technical expert who understands model, parameters and simulation configuration

**Actions**: Create the Cookbook App

**Primary Interface**: PTDataX (better interface for technical users)

## Workflow Steps

### 1. Authentication & Access

- Access PTDataX interface directly
- Authenticate through CKAN
- Navigate to Modeler Dashboard

### 2. Data Management

- Upload new data via web forms (stored in Corral)
- OR select existing data from CKAN catalog
- PTDataX processes uploaded data and registers metadata in CKAN

### 3. Job Configuration & Execution

- Browse available TAPIS applications (Modflow, Whisper transcription, simulations)
- Select appropriate application
- Configure job parameters and select input data
- Submit job to TAPIS for execution

### 4. Monitoring & Results

- Monitor job execution status via webhook notifications
- Receive real-time updates through PTDataX
- View job outputs when complete
- All outputs automatically registered in CKAN with metadata

### 5. Output Analysis

- Access completed job results
- Outputs become available for Technical Analysts to use
- Can initiate new workflows based on results

## Key Capabilities

- Upload data via web forms (stored in Corral)
- Browse and select TAPIS applications (Modflow, Whisper transcription, other simulations)
- Configure and submit complex jobs with custom parameters
- Monitor job execution status
- View and analyze job outputs

## Technical Knowledge Level

**High** - understands model parameters and simulation configuration
