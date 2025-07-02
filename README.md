# Stories UI

A React application for capturing and displaying stories with integrated resource management and audio/video transcription capabilities powered by DYNAMO Ensemble Manager.

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/stories-ui.git
   cd stories-ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```bash
   VITE_TAPIS_API_BASE_URL=your_tapis_api_url
   VITE_CKAN_BASE_URL=your_ckan_base_url
   VITE_MAX_FILE_SIZE=52428800  # 50MB in bytes
   VITE_DYNAMO_API_BASE_URL=your_dynamo_api_url  # For transcription features
   VITE_DYNAMO_DASHBOARD_URL=your_dynamo_dashboard_url  # For viewing transcription results
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

The following environment variables are required:

- `VITE_TAPIS_API_BASE_URL`: Base URL for the Tapis API
- `VITE_CKAN_BASE_URL`: Base URL for the CKAN instance
- `VITE_MAX_FILE_SIZE`: Maximum file size in bytes for resource uploads (default: 52428800 for 50MB)
- `VITE_DYNAMO_API_BASE_URL`: Base URL for DYNAMO Ensemble Manager API (optional, for transcription features)
- `VITE_DYNAMO_DASHBOARD_URL`: Base URL for DYNAMO Dashboard (optional, for viewing transcription results)

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run linter
- `npm run preview` - Preview production build

## Deployment

The application can be deployed as a static site or using Docker:

```bash
# Build for production
npm run build

# Using Docker
docker build -t stories-ui .
docker run -p 8080:80 stories-ui
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Stories Application - Resource Management

## Adding Resources

The Stories application allows you to add various types of resources to your stories. This guide explains how to add and manage resources effectively.

### Supported Resource Types

The application supports the following file formats:

- **Documents**: PDF, DOC, XLS, CSV
- **Images**: JPG, PNG
- **Media**: Audio files (MP3, WAV, etc.) and Video files (MP4, AVI, etc.) with transcription support

**Note:** Maximum file size is configured in the environment variables (`VITE_MAX_FILE_SIZE`). The default is set to 50MB, but this can be adjusted based on your CKAN instance configuration.

### How to Add Resources

There are two ways to add resources to your story:

1. **Using the Resources Panel**

   - Click the "Add Resource" button in the header
   - A modal will open where you can:
     - Drag and drop files
     - Click "browse" to select files from your computer
     - Add multiple files at once
     - Preview files before adding them
     - Remove files before submission

2. **Using the Create Resource Form**
   - Navigate to the "Create New Story" page
   - Fill out the resource details:
     - Name (required)
     - Description (optional, max 1000 characters)
     - Upload file(s)

### Resource Management Features

Once resources are added, you can:

1. **View Resources**

   - Access the Resources Panel at the bottom of the screen
   - Expand/collapse the panel using the chevron icon
   - Maximize the panel for a full-screen view
   - See resource details including:
     - Name
     - Type
     - Size
     - Preview option
     - Embed option

2. **Resource Actions**
   - **Preview**: View the resource content
   - **Embed**: Insert the resource into your story
   - **Transcribe**: Convert audio/video files to text using DYNAMO (available for audio and video files)
   - **Download**: Download the resource file
   - **Remove**: Delete resources from your story

## Audio/Video Transcription

The Stories application includes integrated transcription capabilities powered by DYNAMO Ensemble Manager, allowing you to convert audio and video files into text.

### Transcription Features

- **Supported Media**: Audio files (MP3, WAV, etc.) and Video files (MP4, AVI, etc.)
- **DYNAMO Integration**: Uses DYNAMO Ensemble Manager for processing
- **Workflow Management**: Organize transcriptions into problem statements, tasks, and subtasks
- **Progress Tracking**: Real-time updates on transcription status
- **Dashboard Integration**: View results and monitor progress in DYNAMO Dashboard

### How to Transcribe Media Files

1. **Upload Media File**
   - Add an audio or video file as a resource to your story
   - The "Transcribe" button will automatically appear for supported media files

2. **Start Transcription**
   - Click the "Transcribe" button on any audio/video resource
   - A modal will open with the transcription workflow

3. **Transcription Workflow**
   
   **Step 1: Choose Analysis Type**
   - Select "Audio/Video Transcription" from available analysis options
   
   **Step 2: Problem Statement**
   - Choose an existing problem statement or create a new one
   - Problem statements help organize related transcription tasks
   - Specify region (Texas or Alaska) and time period
   
   **Step 3: Configuration**
   - Set task and subtask names for organization
   - Names are auto-generated but can be customized
   
   **Step 4: Processing**
   - The system automatically:
     - Creates or reuses existing tasks
     - Configures the transcription model
     - Submits the job to DYNAMO
   
   **Step 5: Results**
   - View submission confirmation
   - Access links to DYNAMO Dashboard for monitoring
   - Track transcription progress and results

### Transcription Management

- **Problem Statements**: Group related transcription tasks by research topic or project
- **Tasks & Subtasks**: Organize transcriptions within problem statements
- **Reusable Workflows**: Existing problem statements can be reused for new transcriptions
- **Dashboard Monitoring**: Use DYNAMO Dashboard to track progress and view results

### Configuration Requirements

To enable transcription features, configure these environment variables:

```bash
# Required for transcription functionality
VITE_DYNAMO_API_BASE_URL=https://your-dynamo-api.example.com/v1
VITE_DYNAMO_DASHBOARD_URL=https://your-dynamo-dashboard.example.com
```

**Note**: Transcription features require a valid DYNAMO Ensemble Manager instance and appropriate authentication through your Tapis account.

### Best Practices

1. **File Organization**

   - Use descriptive names for your resources
   - Add meaningful descriptions to help others understand the content
   - Group related resources together

2. **File Size Considerations**

   - Optimize large files before uploading
   - Consider splitting large datasets into smaller chunks
   - Use appropriate file formats for your content
   - Check the configured maximum file size limit

3. **Resource Management**
   - Regularly review and update your resources
   - Remove outdated or unnecessary resources
   - Keep resource descriptions up to date

### Troubleshooting

If you encounter issues while adding resources:

1. **Upload Failures**

   - Check file size against the configured limit (`VITE_MAX_FILE_SIZE`)
   - Verify file format is supported
   - Ensure you have a stable internet connection

2. **Resource Display Issues**
   - Try refreshing the page
   - Check if the resource is still available
   - Verify file permissions

3. **Transcription Issues**
   - Verify DYNAMO API configuration (`VITE_DYNAMO_API_BASE_URL`)
   - Check authentication with Tapis
   - Ensure media file is in a supported format
   - Monitor progress in DYNAMO Dashboard
   - Contact support if transcription jobs fail or hang

### Security Considerations

- Only upload files you have permission to share
- Be mindful of sensitive information in your resources
- Follow your organization's data sharing policies

For additional help or questions, please contact the support team.
