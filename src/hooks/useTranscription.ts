import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { 
  dynamoApiService, 
  ProblemStatement, 
  ANALYSIS_TYPES,
  SubmitSubtaskResponse 
} from '../services/dynamoApi';
import { Resource } from '../types/resource';
import { useExecutionPolling, PollingConfig } from './useExecutionPolling';

export interface TranscriptionStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  message: string;
}

export interface TranscriptionConfig {
  taskName: string;
  subtaskName: string;
  problemStatementId: string;
  analysisType: string;
}

export interface TranscriptionResult {
  problemStatementId: string;
  taskId: string;
  subtaskId: string;
  dashboardUrl: string;
  region: string;
}

export const useTranscription = () => {
  const { accessToken } = useAuth();
  const [steps, setSteps] = useState<TranscriptionStep[]>([]);
  const [currentResult, setCurrentResult] = useState<TranscriptionResult | null>(null);
  const [pollingConfig, setPollingConfig] = useState<PollingConfig | null>(null);

  // Use the execution polling hook
  const executionPolling = useExecutionPolling(pollingConfig);

  // Query to fetch problem statements
  const {
    data: problemStatements = [],
    isLoading: isLoadingProblems,
    refetch: refetchProblems
  } = useQuery({
    queryKey: ['problemStatements'],
    queryFn: () => dynamoApiService.getProblemStatements(accessToken!),
    enabled: !!accessToken,
  });

  // Mutation to create problem statement
  const createProblemStatementMutation = useMutation({
    mutationFn: (data: Omit<ProblemStatement, 'id'>) =>
      dynamoApiService.createProblemStatement(data, accessToken!),
    onSuccess: () => {
      refetchProblems();
    },
  });

  // Main transcription mutation
  const transcriptionMutation = useMutation({
    mutationFn: async ({
      resource,
      config,
      problemStatement
    }: {
      resource: Resource;
      config: TranscriptionConfig;
      problemStatement: ProblemStatement;
    }) => {
      if (!accessToken) throw new Error('No access token available');

      const analysisConfig = ANALYSIS_TYPES[config.analysisType];
      if (!analysisConfig) throw new Error('Invalid analysis type');

      // Initialize steps
      const initialSteps: TranscriptionStep[] = [
        { id: 'step1', title: 'Creating task and subtask', status: 'pending', message: 'Preparing to create task and subtask...' },
        { id: 'step2', title: 'Setting up model configuration', status: 'pending', message: 'Waiting for task creation...' },
        { id: 'step3', title: 'Submitting analysis', status: 'pending', message: 'Waiting for model setup...' }
      ];
      setSteps(initialSteps);

      // Step 1: Create task and subtask
      updateStep('step1', 'Creating task and subtask...', 'active');
      
      // Check for existing task
      const existingTask = await dynamoApiService.findExistingTaskForDataset(
        config.problemStatementId,
        resource.dataset?.id || '',
        resource.name,
        accessToken
      );

      let taskId: string;
      let subtaskId: string;

      if (existingTask) {
        taskId = existingTask.id!;
        // Create only subtask
        const subtask = await dynamoApiService.createSubtask(
          config.problemStatementId,
          taskId,
          {
            name: config.subtaskName,
            driving_variables: analysisConfig.drivingVariables,
            response_variables: analysisConfig.responseVariables,
            dates: problemStatement.dates,
            dataset_id: resource.dataset?.id || ''
          },
          accessToken
        );
        subtaskId = subtask.id!;
      } else {
        // Create new task
        const task = await dynamoApiService.createTask(
          config.problemStatementId,
          {
            name: config.taskName,
            dates: problemStatement.dates
          },
          accessToken
        );
        taskId = task.id!;

        // Create subtask
        const subtask = await dynamoApiService.createSubtask(
          config.problemStatementId,
          taskId,
          {
            name: config.subtaskName,
            driving_variables: analysisConfig.drivingVariables,
            response_variables: analysisConfig.responseVariables,
            dates: problemStatement.dates,
            dataset_id: resource.dataset?.id || ''
          },
          accessToken
        );
        subtaskId = subtask.id!;
      }

      updateStep('step1', 'Task and subtask created successfully!', 'completed');

      // Step 2: Setup model configuration
      updateStep('step2', 'Setting up model configuration...', 'active');
      
      const setupRequest = { ...analysisConfig.setupRequest };
      const dataItem = setupRequest.data.find(item => item.id === analysisConfig.inputDataId);
      if (dataItem) {
        dataItem.dataset = {
          id: resource.dataset?.id || '',
          resources: [{
            id: resource.id,
            url: resource.url
          }]
        };
      }

      await dynamoApiService.setupModelConfiguration(
        config.problemStatementId,
        taskId,
        subtaskId,
        setupRequest,
        accessToken
      );

      updateStep('step2', 'Model configuration setup complete!', 'completed');

      // Step 3: Submit subtask
      updateStep('step3', 'Submitting analysis...', 'active');
      
      await dynamoApiService.submitSubtask(
        config.problemStatementId,
        taskId,
        subtaskId,
        { model_id: analysisConfig.modelId },
        accessToken
      );

      updateStep('step3', 'Analysis submitted successfully!', 'completed');

      // Start polling for execution status
      setPollingConfig({
        problemStatementId: config.problemStatementId,
        taskId,
        subtaskId,
      });

      const result: TranscriptionResult = {
        problemStatementId: config.problemStatementId,
        taskId,
        subtaskId,
        dashboardUrl: dynamoApiService.getDashboardUrl(
          problemStatement.regionid,
          config.problemStatementId,
          taskId,
          subtaskId
        ),
        region: problemStatement.regionid
      };

      setCurrentResult(result);
      return result;
    },
    onError: (error: Error) => {
      // Find the current active step and mark it as error
      setSteps(prevSteps => 
        prevSteps.map(step => 
          step.status === 'active' 
            ? { ...step, status: 'error', message: `Error: ${error.message}` }
            : step
        )
      );
    }
  });

  const updateStep = useCallback((stepId: string, message: string, status: TranscriptionStep['status']) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, message, status } : step
      )
    );
  }, []);

  const resetTranscription = useCallback(() => {
    setSteps([]);
    setCurrentResult(null);
    setPollingConfig(null);
    executionPolling.resetPolling();
    transcriptionMutation.reset();
  }, [executionPolling]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // Data
    problemStatements,
    steps,
    currentResult,
    
    // Loading states
    isLoadingProblems,
    isTranscribing: transcriptionMutation.isPending,
    
    // Actions
    createProblemStatement: createProblemStatementMutation.mutateAsync,
    startTranscription: transcriptionMutation.mutateAsync,
    resetTranscription,
    startPolling: executionPolling.startPolling,
    stopPolling: executionPolling.stopPolling,
    
    // Mutation states
    transcriptionError: transcriptionMutation.error,
    isTranscriptionSuccess: transcriptionMutation.isSuccess,
    
    // Problem statement creation
    isCreatingProblem: createProblemStatementMutation.isPending,
    createProblemError: createProblemStatementMutation.error,
    
    // Execution polling states
    executions: executionPolling.executions,
    isPolling: executionPolling.isPolling,
    isExecutionComplete: executionPolling.isComplete,
    executionError: executionPolling.error,
    executionSummary: executionPolling.getExecutionSummary(),
    hasSuccessfulExecution: executionPolling.hasSuccessfulExecution(),
    hasFailedExecution: executionPolling.hasFailedExecution(),
    latestExecution: executionPolling.getLatestExecution(),
  };
};