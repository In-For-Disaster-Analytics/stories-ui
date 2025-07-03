import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dynamoApiService, Execution } from '../services/dynamoApi';

export interface PollingConfig {
  problemStatementId: string;
  taskId: string;
  subtaskId: string;
  interval?: number; // milliseconds, default 5000 (5 seconds)
  maxAttempts?: number; // default 120 (10 minutes at 5s intervals)
  stopOnStatus?: string[]; // default ['SUCCESS', 'FAILURE', 'FAILED', 'CANCELLED']
}

export interface ExecutionStatus {
  executions: Execution[];
  isPolling: boolean;
  isComplete: boolean;
  hasError: boolean;
  error: Error | null;
  attempts: number;
  lastUpdated: Date | null;
}

export const useExecutionPolling = (config: PollingConfig | null) => {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState<ExecutionStatus>({
    executions: [],
    isPolling: false,
    isComplete: false,
    hasError: false,
    error: null,
    attempts: 0,
    lastUpdated: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const configRef = useRef<PollingConfig | null>(config);

  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus((prev) => ({ ...prev, isPolling: false }));
  }, []);

  const checkExecutions = useCallback(
    async (currentConfig: PollingConfig): Promise<boolean> => {
      if (!accessToken) {
        throw new Error('No access token available');
      }

      try {
        const response = await dynamoApiService.getSubtaskExecutions(
          currentConfig.problemStatementId,
          currentConfig.taskId,
          currentConfig.subtaskId,
          accessToken,
        );

        const executions = response.executions || [];
        const stopStatuses = currentConfig.stopOnStatus || [
          'SUCCESS',
          'FAILURE',
          'FAILED',
          'CANCELLED',
        ];

        // Check if any execution has reached a final status
        const hasCompletedExecution = executions.some(
          (execution) =>
            execution.status &&
            stopStatuses.includes(execution.status.toUpperCase()),
        );

        setStatus((prev) => ({
          ...prev,
          executions,
          isComplete: hasCompletedExecution,
          lastUpdated: new Date(),
          attempts: prev.attempts + 1,
          hasError: false,
          error: null,
        }));

        return hasCompletedExecution;
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error('Unknown error occurred');
        setStatus((prev) => ({
          ...prev,
          hasError: true,
          error: errorObj,
          lastUpdated: new Date(),
          attempts: prev.attempts + 1,
        }));
        throw errorObj;
      }
    },
    [accessToken],
  );

  const startPolling = useCallback(async () => {
    const currentConfig = configRef.current;
    if (!currentConfig || !accessToken) return;

    const interval = currentConfig.interval || 5000;
    const maxAttempts = currentConfig.maxAttempts || 120;

    setStatus((prev) => ({
      ...prev,
      isPolling: true,
      isComplete: false,
      hasError: false,
      error: null,
      attempts: 0,
    }));

    // Initial check
    try {
      const isComplete = await checkExecutions(currentConfig);
      if (isComplete) {
        stopPolling();
        return;
      }
    } catch (error) {
      console.error('Initial execution check failed:', error);
      stopPolling();
      return;
    }

    // Set up polling interval
    intervalRef.current = setInterval(async () => {
      const config = configRef.current;
      if (!config) {
        stopPolling();
        return;
      }

      try {
        // Get current attempts from state
        setStatus((prevStatus) => {
          if (prevStatus.attempts >= maxAttempts) {
            const timeoutError = new Error(
              `Polling timeout: Maximum attempts (${maxAttempts}) reached`,
            );
            stopPolling();
            return {
              ...prevStatus,
              hasError: true,
              error: timeoutError,
              isPolling: false,
            };
          }
          return prevStatus;
        });

        const isComplete = await checkExecutions(config);
        if (isComplete) {
          stopPolling();
        }
      } catch (error) {
        console.error('Polling execution check failed:', error);
        // Don't stop polling on individual failures, just log them
        // The error is already set in checkExecutions
      }
    }, interval);
  }, [accessToken, checkExecutions, stopPolling]);

  const resetPolling = useCallback(() => {
    stopPolling();
    setStatus({
      executions: [],
      isPolling: false,
      isComplete: false,
      hasError: false,
      error: null,
      attempts: 0,
      lastUpdated: null,
    });
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Stop polling when config becomes null
  useEffect(() => {
    if (!config) {
      stopPolling();
    }
  }, [config, stopPolling]);

  // Helper functions to get execution status info
  const getExecutionSummary = useCallback(() => {
    const { executions } = status;
    if (executions.length === 0) {
      return { total: 0, running: 0, completed: 0, failed: 0, progress: 0 };
    }

    const total = executions.length;
    const completed = executions.filter(
      (e) => e.status && ['SUCCESS'].includes(e.status.toUpperCase()),
    ).length;
    const failed = executions.filter(
      (e) =>
        e.status &&
        ['FAILURE', 'FAILED', 'CANCELLED'].includes(e.status.toUpperCase()),
    ).length;
    const running = total - completed - failed;
    const progress =
      executions.reduce((sum, e) => sum + (e.run_progress || 0), 0) / total;

    return { total, running, completed, failed, progress };
  }, [status.executions]);

  const getLatestExecution = useCallback((): Execution | null => {
    if (status.executions.length === 0) return null;
    // Return the most recent execution (assuming they're ordered by creation)
    return status.executions[status.executions.length - 1];
  }, [status.executions]);

  const hasSuccessfulExecution = useCallback((): boolean => {
    return status.executions.some(
      (e) => e.status && e.status.toUpperCase() === 'SUCCESS',
    );
  }, [status.executions]);

  const hasFailedExecution = useCallback((): boolean => {
    return status.executions.some(
      (e) =>
        e.status &&
        ['FAILURE', 'FAILED', 'CANCELLED'].includes(e.status.toUpperCase()),
    );
  }, [status.executions]);

  return {
    // Status
    ...status,

    // Actions
    startPolling,
    stopPolling,
    resetPolling,

    // Helpers
    getExecutionSummary,
    getLatestExecution,
    hasSuccessfulExecution,
    hasFailedExecution,

    // Computed properties
    canStart: !!config && !!accessToken && !status.isPolling,
  };
};
