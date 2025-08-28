# Stories UI

A React application for capturing and displaying stories with integrated resource management and analysis workflows (transcription, narrative analysis, topic classification) powered by DYNAMO Ensemble Manager and TapisApps.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
- [User Guide](#user-guide)
  - [Story Management](#story-management)
  - [Resource Management](#resource-management)
  - [Audio/Video Transcription](#audiovideo-transcription)
  - [Transcription Editor](#transcription-editor)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Story Management**: Create, edit, and organize stories with basic text content
- **Resource Management**: Upload and manage various file types (documents, images, audio, video)
- **Analysis Workflows**: AI-powered analysis including transcription, narrative analysis, and topic classification using TapisApps through DYNAMO Ensemble Manager
- **Transcription Editor**: Advanced editor for reviewing and editing transcription results
- **Authentication**: Secure authentication via Tapis API
- **Responsive Design**: Modern, responsive UI built with React and TailwindCSS

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/stories-ui.git
cd stories-ui

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## Development Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Git**: For version control

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/stories-ui.git
   cd stories-ui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```bash
   # Required Environment Variables
   VITE_TAPIS_API_BASE_URL=https://your-tapis-api.example.com
   VITE_CKAN_BASE_URL=https://your-ckan.example.com
   VITE_MAX_FILE_SIZE=52428800  # 50MB in bytes

   # Optional - For transcription features
   VITE_DYNAMO_API_BASE_URL=https://your-dynamo-api.example.com/v1
   VITE_DYNAMO_DASHBOARD_URL=https://your-dynamo-dashboard.example.com
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Environment Configuration

### Required Variables

| Variable                  | Description                           | Example                    |
| ------------------------- | ------------------------------------- | -------------------------- |
| `VITE_TAPIS_API_BASE_URL` | Base URL for Tapis API authentication | `https://api.tapis.io`     |
| `VITE_CKAN_BASE_URL`      | Base URL for CKAN data management     | `https://ckan.example.com` |
| `VITE_MAX_FILE_SIZE`      | Maximum file upload size in bytes     | `52428800` (50MB)          |

### Optional Variables

| Variable                    | Description                 | Default                             |
| --------------------------- | --------------------------- | ----------------------------------- |
| `VITE_DYNAMO_API_BASE_URL`  | DYNAMO Ensemble Manager API | `http://localhost:3000/v1`          |
| `VITE_DYNAMO_DASHBOARD_URL` | DYNAMO Dashboard URL        | `https://dashboard.dynamo.mint.edu` |

**Note**: The build process validates required environment variables and will fail if they are missing.

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build for production (TypeScript + Vite) |
| `npm run lint`    | Run ESLint code linting                  |
| `npm run preview` | Preview production build locally         |
| `npm run test`    | Run test suite with Vitest               |

## Architecture Overview

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v5
- **State Management**: React Context + TanStack Query
- **Testing**: Vitest with jsdom environment
- **Authentication**: JWT via Tapis API
- **Data Storage**: CKAN for datasets and resources

### Key Components

```
src/
├── app/                    # Main application features
│   ├── Home/              # Home page components
│   ├── Login/             # Authentication components
│   ├── Pages/             # Main page components
│   │   ├── ResourcesList/ # Resource management
│   │   ├── StoriesList/   # Story listing
│   │   └── TranscriptionEditor/ # Transcription editing
│   └── Stories/           # Story management
├── components/            # Reusable UI components
├── contexts/              # React contexts
├── hooks/                 # Custom hooks (auth, ckan)
├── services/              # API services
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```

### Authentication Flow

1. User logs in via Tapis API
2. JWT token stored in localStorage
3. Token included in API requests
4. Protected routes enforced via `ProtectedRoute` component

## User Guide

### Story Management

**Creating Stories:**

1. Navigate to the Stories page
2. Click "Create New Story"
3. Fill in story details (title, description)
4. Add resources and content
5. Save your story

**Editing Stories:**

- Click on any story from the list
- Use the editor to modify content
- Add or remove resources
- Changes are saved automatically

### Resource Management

#### Supported File Types

- **Documents**: PDF, DOC, XLS, CSV
- **Images**: JPG, PNG, GIF
- **Audio**: MP3, WAV, FLAC, M4A
- **Video**: MP4, AVI, MOV, WebM

#### Adding Resources

1. **Via Resources Panel:**

   - Click "Add Resource" button
   - Drag and drop files or browse to select
   - Add multiple files simultaneously
   - Preview before upload

2. **Via Story Editor:**
   - Use the resource panel in the editor
   - Upload files directly while editing
   - Embed resources into story content

#### Resource Actions

- **Preview**: View file content in browser
- **Embed**: Insert resource into story
- **Download**: Download original file
- **Transcribe**: Convert audio/video to text (DYNAMO)
- **Edit**: Modify resource details
- **Delete**: Remove from story

### Audio/Video Transcription

The application provides AI-powered transcription for audio and video files using DYNAMO Ensemble Manager.

#### Starting Transcription

1. Upload audio or video file as resource
2. Click "Transcribe" button on the resource
3. Follow the workflow steps:
   - **Analysis Type**: Select "Audio/Video Transcription"
   - **Problem Statement**: Choose existing or create new
   - **Configuration**: Set task and subtask names
   - **Submission**: Job submitted to DYNAMO
   - **Monitoring**: Track progress in DYNAMO Dashboard

#### Transcription Workflow

**Problem Statements**: Organize transcriptions by research topic or project

- Reusable across multiple transcription jobs
- Include region (Texas/Alaska) and time period
- Help categorize and manage related work

**Tasks & Subtasks**: Hierarchical organization within problem statements

- Auto-generated names based on resource
- Customizable during setup
- Enable detailed tracking and reporting

### Transcription Editor

Advanced editor for reviewing and editing transcription results.

#### Features

- **Time-synchronized playback**: Audio/video synced with text segments
- **Segment editing**: Modify individual transcription segments
- **Speaker identification**: Edit and assign speakers
- **Text splitting**: Intelligent segment splitting capabilities
- **Annotations**: Add notes and annotations to segments
- **Media controls**: Integrated playback controls
- **Auto-save**: Automatic saving of changes

#### Accessing the Editor

1. Navigate to a story with transcription resources
2. Click "Edit Transcription" on any transcription resource
3. Editor opens with media player and transcription segments
4. Make edits and save changes

#### Editor Controls

- **Play/Pause**: Control media playback
- **Seek**: Jump to specific timestamps
- **Split Segment**: Divide segments at specific points
- **Merge Segments**: Combine adjacent segments
- **Edit Text**: Modify transcription text
- **Add Annotations**: Include additional notes
- **Speaker Assignment**: Change speaker labels

## Deployment

### Static Site Deployment

Build and deploy as a static site:

```bash
# Build for production
npm run build

# Deploy dist/ directory to your hosting provider
# Examples: Netlify, Vercel, GitHub Pages, S3, etc.
```

### Docker Deployment

1. **Build Docker image:**

   ```bash
   docker build -t stories-ui .
   ```

2. **Run container:**

   ```bash
   docker run -p 8080:80 \
     -e VITE_TAPIS_API_BASE_URL=https://your-tapis-api.example.com \
     -e VITE_CKAN_BASE_URL=https://your-ckan.example.com \
     -e VITE_MAX_FILE_SIZE=52428800 \
     stories-ui
   ```

3. **Docker Compose (with environment file):**

   ```yaml
   version: '3.8'
   services:
     stories-ui:
       build: .
       ports:
         - '8080:80'
       environment:
         - VITE_TAPIS_API_BASE_URL=${VITE_TAPIS_API_BASE_URL}
         - VITE_CKAN_BASE_URL=${VITE_CKAN_BASE_URL}
         - VITE_MAX_FILE_SIZE=${VITE_MAX_FILE_SIZE}
   ```

### Production Environment Setup

4. **Run Compose:**

   ```bash
   docker compose --env-file (/path/to/your/.env-file) up
   ```
**Environment Variables for Production:**

```bash
# Production configuration
NODE_ENV=production
VITE_TAPIS_API_BASE_URL=https://api.tapis.io
VITE_CKAN_BASE_URL=https://your-production-ckan.example.com
VITE_MAX_FILE_SIZE=104857600  # 100MB for production
VITE_DYNAMO_API_BASE_URL=https://dynamo-api.example.com/v1
VITE_DYNAMO_DASHBOARD_URL=https://dashboard.dynamo.example.com
```

**Production Checklist:**

- [ ] Environment variables configured
- [ ] HTTPS/SSL certificates installed
- [ ] CORS policies configured on APIs
- [ ] File upload limits set appropriately
- [ ] Authentication endpoints accessible
- [ ] CKAN instance properly configured
- [ ] DYNAMO services available (if using transcription)

### Hosting Options

1. **Netlify**: Connect GitHub repo for automatic deployments
2. **Vercel**: Zero-config deployment with edge functions
3. **AWS S3 + CloudFront**: Static hosting with CDN
4. **GitHub Pages**: Free hosting for public repositories
5. **Traditional Web Servers**: Apache, Nginx with static files

## API Integration

### Tapis API

Used for authentication and user management.

**Configuration:**

```javascript
// Set VITE_TAPIS_API_BASE_URL in environment
const tapisClient = new TapisClient({
  baseUrl: import.meta.env.VITE_TAPIS_API_BASE_URL,
});
```

### CKAN API

Handles datasets (stories) and resources (files).

**Key Endpoints:**

- `GET /api/3/action/package_list` - List datasets
- `POST /api/3/action/package_create` - Create dataset
- `POST /api/3/action/resource_create` - Upload resource
- `GET /api/3/action/package_show` - Get dataset details

### DYNAMO API

Powers transcription services.

**Configuration:**

```javascript
// Optional - only needed for transcription features
const dynamoApiUrl = import.meta.env.VITE_DYNAMO_API_BASE_URL;
```

## Troubleshooting

### Common Issues

#### Authentication Problems

**Issue**: Login fails or token expires quickly
**Solutions:**

- Verify `VITE_TAPIS_API_BASE_URL` is correct
- Check network connectivity to Tapis API
- Ensure credentials are valid
- Clear localStorage and try again

#### File Upload Issues

**Issue**: Files fail to upload
**Solutions:**

- Check file size against `VITE_MAX_FILE_SIZE` limit
- Verify file type is supported
- Ensure CKAN instance is accessible
- Check CORS configuration on CKAN

#### Transcription Problems

**Issue**: Transcription fails to start or complete
**Solutions:**

- Verify `VITE_DYNAMO_API_BASE_URL` configuration
- Check audio/video file format compatibility
- Ensure DYNAMO services are running
- Monitor job status in DYNAMO Dashboard

#### Build/Development Issues

**Issue**: Build fails or development server won't start
**Solutions:**

- Verify all required environment variables are set
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility (18+)
- Review build logs for specific error messages

### Debug Mode

Enable debug logging:

```bash
# Development
npm run dev

# Add to .env for persistent debugging
VITE_DEBUG=true
```

### Performance Issues

**Large Files:**

- Optimize files before upload
- Consider chunked uploads for very large files
- Monitor network bandwidth

**Slow Loading:**

- Check API response times
- Optimize images and media files
- Enable browser caching

## Maintenance

### Regular Maintenance Tasks

#### Weekly

- [ ] Review application logs for errors
- [ ] Check file storage usage and cleanup old files
- [ ] Monitor API rate limits and usage
- [ ] Verify backup systems are working

#### Monthly

- [ ] Update dependencies (`npm audit` and `npm update`)
- [ ] Review and rotate API keys if needed
- [ ] Check SSL certificate expiration
- [ ] Performance monitoring and optimization

#### Quarterly

- [ ] Security audit and vulnerability assessment
- [ ] Review and update documentation
- [ ] Disaster recovery testing
- [ ] User feedback review and feature planning

### Monitoring

**Key Metrics to Monitor:**

- Application uptime and response times
- File upload success rates
- Authentication success rates
- Transcription job completion rates
- Storage usage and growth trends

### Backup Strategy

**Data to Backup:**

- User stories and metadata (CKAN datasets)
- Uploaded files and resources
- Transcription results
- User account data (if stored locally)

**Backup Frequency:**

- Daily: Incremental backups of new/changed data
- Weekly: Full system backup
- Monthly: Archive to long-term storage

### Security Considerations

**Best Practices:**

- Regular security updates for all dependencies
- Secure storage of environment variables
- HTTPS enforcement in production
- Regular access review and cleanup
- Input validation and sanitization
- CORS policy configuration

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and add tests
4. Run tests: `npm run test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add new feature'`
7. Push to branch: `git push origin feature/new-feature`
8. Submit a Pull Request

### Code Standards

- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation for new features
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For additional help or questions, please contact the support team or open an issue on GitHub.
