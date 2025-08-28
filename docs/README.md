Decision System - Sites and Stories - Project Summary and Requirements
System Overview
Decision Systems integrate multiple existing services to provide a cohesive platform for data processing and analysis. This project, Sites and Stories, aims to create a user-friendly interface for modelers and technical analysts to manage data workflows, run simulations, and analyze results using a combination of PTDataX, CKAN, TAPIS, and Corral.
System Architecture Components
Core Services

Sites and Stories: Main user interface application (the project being developed)
PTDataX: Django web service component for data workflow orchestration
CKAN: Data catalog providing metadata management, authorization, and authentication
TAPIS: Workflow execution system with job submission and webhook notifications
Corral: Data storage system for uploaded files

User Personas and Workflows

1. Modeler/Data Scientist
   Capabilities:

Upload data via web forms (stored in Corral)
Browse and select TAPIS applications (Modflow, Whisper transcription, other simulations)
Configure and submit complex jobs with custom parameters
Monitor job execution status
View and analyze job outputs

Technical Knowledge: High - understands model parameters and simulation configuration 2. Technical Analyst
Capabilities:

Access CKAN datasets (grouped collections of inputs/outputs/resources)
Use pre-configured TAPIS analysis apps (narrative analysis, transcript analysis, topic analysis)
Run simplified analysis workflows with user-friendly interfaces
Create business reports from analysis results
Target audience: Planners, Directors, Chief of Staff

Technical Knowledge: Limited - can use tools but doesn't create or configure them
Key Data Flow Requirements
Data Lifecycle Management

Input Data: Uploaded via Sites and Stories interface → PTDataX processes → Stored in Corral → Metadata registered in CKAN
Job Execution: TAPIS apps process data → Webhook notifications update Sites and Stories via PTDataX
Output Registration: CRITICAL - All job outputs must be registered in CKAN with metadata including:

Dataset descriptions
Provenance information (which workflow generated the output)
Access permissions and authorization rules

Analysis Phase: Technical Analysts work with CKAN datasets using simplified analysis tools through Sites and Stories interface

Authentication and Authorization

All user authentication handled through CKAN
CKAN manages data access permissions
Role-based access control for different user types

Technical Implementation Considerations
Dashboard Requirements

Modeler Dashboard: Job management, app selection, parameter configuration
Technical Analyst Dashboard:

Loads CKAN datasets automatically
Presents analysis tools as simple, pre-configured options
Abstracts technical complexity
Dataset-centric workflow (work with logical data units, not individual files)

Integration Points

PTDataX Integration: Orchestrates data workflows and communicates with other services
TAPIS API Integration: Query available apps, submit jobs, receive webhook notifications (via PTDataX)
CKAN API Integration: Register datasets, manage metadata, handle authentication (via PTDataX)
Webhook Handling: Real-time job status updates from TAPIS routed through PTDataX to Sites and Stories
Error Handling: Failed job notifications and retry mechanisms

Design Principles
User Experience

Separation of Concerns: Technical complexity hidden from business users
Role-Based Interfaces: Different dashboards for different user capabilities
Dataset-Centric Design: Group related files as logical units
Simplified Analysis Tools: Pre-configured apps for non-technical users

Data Governance

Complete Cataloging: All data (inputs and outputs) registered in CKAN
Metadata Management: Rich metadata for discoverability and compliance
Provenance Tracking: Full lineage from input through processing to outputs
Access Control: Authorization rules applied throughout the data lifecycle

Suggested Development Approach
Phase 1: Core Infrastructure

Sites and Stories main application with PTDataX integration
User authentication through CKAN
Basic data upload and TAPIS workflow integration
Job submission and status tracking

Phase 2: Advanced Features

Output registration in CKAN with metadata (via PTDataX)
Technical Analyst dashboard with simplified analysis tools
Reporting capabilities

Phase 3: Enhancement

Advanced workflow management
Analytics and monitoring
Extended reporting features

Documentation Needs
Consider creating separate user journey diagrams for each persona to improve clarity and reduce complexity in stakeholder communication and development planning.
