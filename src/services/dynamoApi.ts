/**
 * DYNAMO Ensemble Manager API Service
 * Handles communication with the DYNAMO API for transcription and analysis tasks
 */

export interface TimePeriod {
  start_date: string;
  end_date: string;
}

export interface ProblemStatement {
  id?: string;
  name: string;
  regionid: string;
  dates: TimePeriod;
  tasks?: Task[];
}

export interface Task {
  id?: string;
  name: string;
  dates: TimePeriod;
  subtasks?: Subtask[];
}

export interface Subtask {
  id?: string;
  name: string;
  driving_variables: string[];
  response_variables: string[];
  dates: TimePeriod;
  dataset_id: string;
}

export interface DatasetResource {
  id: string;
  url: string;
}

export interface DataItem {
  id: string;
  dataset: {
    id: string;
    resources: DatasetResource[];
  };
}

export interface SetupRequest {
  model_id: string;
  parameters: Array<{
    id: string;
    value: string;
  }>;
  data: DataItem[];
}

export interface SubmitRequest {
  model_id: string;
}

export interface Execution {
  id: string;
  modelid: string;
  bindings?: Record<string, unknown>;
  runid?: string;
  status?: string;
  run_progress?: number;
  results?: unknown[];
  selected?: boolean;
}

export interface Thread {
  name?: string;
  modelid: string;
  datasets?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface SubmitSubtaskResponse {
  thread: Thread;
  executions: Execution[];
}

export interface SubtaskWithExecutions extends Subtask {
  executions?: Execution[];
}

export interface ExecutionsResponse {
  executions: Execution[];
}

export interface Execution_Result {
  model_io?: {
    id: string;
    name: string;
    type: string;
    variables: string[];
    value?: unknown;
    position?: number;
    format?: string;
  };
  resource: {
    id: string;
    name: string;
    url: string;
    time_period?: TimePeriod;
    spatial_coverage?: Record<string, unknown>;
    selected?: boolean;
    type?: string;
  };
}

export interface AnalysisConfig {
  name: string;
  icon: string;
  description: string;
  modelId: string;
  responseVariables: string[];
  drivingVariables: string[];
  inputDataId: string;
  setupRequest: SetupRequest;
}

// Analysis type configurations
export const ANALYSIS_TYPES: Record<string, AnalysisConfig> = {
  audioTranscription: {
    name: 'Audio/Video Transcription',
    icon: '🎤',
    description: 'Transcribe audio and video files into text',
    modelId:
      'https://api.models.mint.tacc.utexas.edu/v1.8.0/modelconfigurations/7c2c8d5f-322b-4c1c-8a85-2c49580eadde?username=mint@isi.edu',
    responseVariables: [],
    drivingVariables: [],
    inputDataId:
      'https://w3id.org/okn/i/mint/7932809f-e71f-423c-ad33-60672ff173b4',
    setupRequest: {
      model_id:
        'https://api.models.mint.tacc.utexas.edu/v1.8.0/modelconfigurations/7c2c8d5f-322b-4c1c-8a85-2c49580eadde?username=mint@isi.edu',
      parameters: [
        {
          id: 'https://w3id.org/okn/i/mint/2bf48012-8087-4ffe-b1db-774e80e7bc24',
          value: '1',
        },
      ],
      data: [
        {
          id: 'https://w3id.org/okn/i/mint/7932809f-e71f-423c-ad33-60672ff173b4',
          dataset: {
            id: '',
            resources: [],
          },
        },
      ],
    },
  },
};

class DynamoApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      import.meta.env.VITE_DYNAMO_API_BASE_URL || 'http://localhost:3000/v1';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    token: string,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    return response.json();
  }

  // Problem Statement operations
  async getProblemStatements(token: string): Promise<ProblemStatement[]> {
    return this.makeRequest<ProblemStatement[]>(
      '/problemStatements',
      { method: 'GET' },
      token,
    );
  }

  async createProblemStatement(
    problemStatement: Omit<ProblemStatement, 'id'>,
    token: string,
  ): Promise<ProblemStatement> {
    return this.makeRequest<ProblemStatement>(
      '/problemStatements',
      {
        method: 'POST',
        body: JSON.stringify(problemStatement),
      },
      token,
    );
  }

  // Task operations
  async getTasks(problemStatementId: string, token: string): Promise<Task[]> {
    return this.makeRequest<Task[]>(
      `/problemStatements/${problemStatementId}/tasks`,
      { method: 'GET' },
      token,
    );
  }

  async createTask(
    problemStatementId: string,
    task: Omit<Task, 'id'>,
    token: string,
  ): Promise<Task> {
    return this.makeRequest<Task>(
      `/problemStatements/${problemStatementId}/tasks`,
      {
        method: 'POST',
        body: JSON.stringify(task),
      },
      token,
    );
  }

  // Subtask operations
  async createSubtask(
    problemStatementId: string,
    taskId: string,
    subtask: Omit<Subtask, 'id'>,
    token: string,
  ): Promise<Subtask> {
    console.log('creating subtask', JSON.stringify(subtask));
    const body = {
      name: subtask.name,
      test: 'test',
      driving_variables: subtask.driving_variables,
      response_variables: subtask.response_variables,
      dates: subtask.dates,
      dataset_id: subtask.dataset_id,
    };

    console.log('subtask body', JSON.stringify(body));
    return this.makeRequest<Subtask>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      token,
    );
  }

  // Model setup and execution
  async setupModelConfiguration(
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
    setupRequest: SetupRequest,
    token: string,
  ): Promise<void> {
    await this.makeRequest<void>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks/${subtaskId}/setup`,
      {
        method: 'POST',
        body: JSON.stringify(setupRequest),
      },
      token,
    );
  }

  async submitSubtask(
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
    submitRequest: SubmitRequest,
    token: string,
  ): Promise<SubmitSubtaskResponse> {
    return this.makeRequest<SubmitSubtaskResponse>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks/${subtaskId}/submit`,
      {
        method: 'POST',
        body: JSON.stringify(submitRequest),
      },
      token,
    );
  }

  // Get executions for a subtask (for polling)
  async getSubtaskExecutions(
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
    token: string,
  ): Promise<ExecutionsResponse> {
    return this.makeRequest<ExecutionsResponse>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks/${subtaskId}/executions`,
      { method: 'GET' },
      token,
    );
  }

  // Get subtask with executions for polling (fallback method)
  async getSubtaskWithExecutions(
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
    token: string,
  ): Promise<SubtaskWithExecutions> {
    return this.makeRequest<SubtaskWithExecutions>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks/${subtaskId}`,
      { method: 'GET' },
      token,
    );
  }

  // Register outputs for a completed execution
  async registerOutputs(
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
    executionId: string,
    token: string,
  ): Promise<Execution_Result[]> {
    return this.makeRequest<Execution_Result[]>(
      `/problemStatements/${problemStatementId}/tasks/${taskId}/subtasks/${subtaskId}/executions/${executionId}/outputs`,
      { method: 'POST' },
      token,
    );
  }

  // Helper method to find existing task for dataset
  async findExistingTaskForDataset(
    problemStatementId: string,
    _datasetId: string,
    packageTitle: string,
    token: string,
  ): Promise<Task | null> {
    try {
      const tasks = await this.getTasks(problemStatementId, token);
      const datasetTaskName = `Dataset Analysis - ${packageTitle}`;
      return tasks.find((task) => task.name === datasetTaskName) || null;
    } catch (error) {
      console.error('Error finding existing task:', error);
      return null;
    }
  }

  // Generate dashboard URL
  getDashboardUrl(
    region: string,
    problemStatementId: string,
    taskId: string,
    subtaskId: string,
  ): string {
    const dashboardBaseUrl =
      import.meta.env.VITE_DYNAMO_DASHBOARD_URL ||
      'https://dashboard.dynamo.mint.edu';
    return `${dashboardBaseUrl}/${region}/modeling/problem_statement/${problemStatementId}/${taskId}/${subtaskId}/runs`;
  }
}

export const dynamoApiService = new DynamoApiService();
