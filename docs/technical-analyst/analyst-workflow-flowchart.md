# Analyst User Flow - Flowchart

Based on the analyst workflow described in `flow.md`, this flowchart represents the complete user journey for technical analysts using the Stories UI system.

```mermaid
flowchart TB
    %% Authentication & Setup
    n1(["Start"]) --> n2["Access Sites and Stories UI"]
    n2 --> n3["Authenticate through Tapis Auth"]
    n3 --> n4["Navigate to Analyst Dashboard"]
    n4 --> n5["Select a Story"]

    %% Story Dashboard - Three Main Steps
    n5 --> n6["Story Dashboard"]
    n6 --> n7["Step 1: Analysis"]
    n6 --> n8["Step 2: Interpretation"]
    n6 --> n9["Step 3: Reporting"]

    %% Analysis Phase
    n7 --> n10["Create Analysis Task"]
    n10 --> n11["Define Task Parameters"]
    n11 --> n12["Data Preparation"]

    %% Data Preparation
    subgraph s1["Data Preparation"]
        n13["Upload Resources into Story"]
        n14["Search for Relevant Datasets from CKAN"]
        n15["Resources Available"]
    end

    n12 --> s1
    n13 --> n15
    n14 --> n15

    %% Analysis Execution
    n15 --> n16["Analysis Execution"]

    subgraph s2["Analysis Tools"]
        n17{"Audio/Video Present?"}
        n18["Transcript Analysis Available"]
        n19{"Documents Present?"}
        n20["Narrative Analysis Available"]
        n21{"Topic Analysis Criteria?"}
        n22["Topic Analysis Available"]
    end

    n16 --> s2
    n17 -- Yes --> n18
    n17 -- No --> n19
    n18 --> n23["Run Transcription Analysis"]
    n19 -- Yes --> n20
    n19 -- No --> n21
    n20 --> n24["Run Narrative Analysis"]
    n21 -- Yes --> n22
    n21 -- No --> n25["No Analysis Available"]
    n22 --> n26["Run Topic Analysis"]

    %% Analysis Results - Feed back into system
    n23 --> n31["Transcription Results in Data Catalog"]
    n24 --> n32["Narrative Results in Data Catalog"]
    n26 --> n33["Topic Results in Data Catalog"]
    n31 --> n34{"More Analysis Needed?"}
    n32 --> n34
    n33 --> n34
    n34 -- Yes --> n16
    n34 -- No --> n27["All Analysis Complete"]
    n25 --> n27

    %% Future Phases (not yet detailed)
    n27 --> n8
    n8 --> n28["Interpret Analysis Results"]
    n28 --> n9
    n9 --> n29["Generate Reports for Leadership"]
    n29 --> n30(["End"])

    %% Styling
    n17@{ shape: diam}
    n19@{ shape: diam}
    n21@{ shape: diam}
    n34@{ shape: diam}
    n23@{ shape: trap-t}
    n24@{ shape: trap-t}
    n26@{ shape: trap-t}
    n27@{ shape: docs}
    n30@{ shape: rounded}

    %% Subgraph styling - Dark theme compatible
    classDef preparation fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#ffffff
    classDef analysis fill:#581c87,stroke:#8b5cf6,stroke-width:2px,color:#ffffff
    classDef future fill:#92400e,stroke:#f59e0b,stroke-width:2px,color:#ffffff
    classDef decision fill:#374151,stroke:#6b7280,stroke-width:2px,color:#ffffff
    classDef process fill:#0f766e,stroke:#14b8a6,stroke-width:2px,color:#ffffff
    classDef result fill:#166534,stroke:#22c55e,stroke-width:2px,color:#ffffff

    class s1 preparation
    class s2 analysis
    class n8,n9,n28,n29 future
    class n17,n19,n21 decision
    class n23,n24,n26 process
    class n27,n31,n32,n33 result
    class n34 decision
```

## Key Features of this Flow:

### Authentication & Setup

- Standard authentication through Tapis Auth
- Story selection from available stories

### Three-Phase Structure

1. **Analysis**: Fully detailed with data preparation and execution
2. **Interpretation**: Placeholder for future development
3. **Reporting**: Placeholder for future development

### Analysis Tools Logic

- **Transcript Analysis**: Enabled when audio/video files are present
- **Narrative Analysis**: Enabled when document files are present
- **Topic Analysis**: Criteria not yet defined (marked as future work)

### Data Sources & Analysis Flow

- Upload new resources directly into the story
- Search and select from existing CKAN datasets (future enhancement)
- **Iterative Analysis**: Analysis results become available as new resources for subsequent analyses
  - Example: Transcription analysis generates documents that can feed Narrative analysis
  - Results are automatically registered in the Data Catalog, expanding available resources
- **Analysis Chaining**: Multiple analysis types can be run sequentially using previous results

## Notes:

- The flowchart focuses on the MVP scope with detailed Analysis phase
- Interpretation and Reporting phases are placeholders for future development
- Topic analysis enablement criteria needs to be defined
- Dataset search functionality is marked for future implementation
