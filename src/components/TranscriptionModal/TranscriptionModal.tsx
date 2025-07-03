import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiArrowLeft,
  FiMic,
  FiExternalLink,
  FiFileText,
} from 'react-icons/fi';
import { Resource } from '../../types/resource';
import {
  useTranscription,
  TranscriptionConfig,
} from '../../hooks/useTranscription';
import {
  ProblemStatement,
  ANALYSIS_TYPES,
  dynamoApiService,
  Execution_Result,
} from '../../services/dynamoApi';
import { useAuth } from '../../contexts/AuthContext';

interface TranscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
}

type ModalStep =
  | 'analysis-type'
  | 'problem-statement'
  | 'configuration'
  | 'progress'
  | 'results';

const TranscriptionModal: React.FC<TranscriptionModalProps> = ({
  isOpen,
  onClose,
  resource,
}) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('analysis-type');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('');
  const [selectedProblemStatement, setSelectedProblemStatement] =
    useState<ProblemStatement | null>(null);
  const [config, setConfig] = useState<Partial<TranscriptionConfig>>({});
  const [newProblemStatement, setNewProblemStatement] = useState({
    name: '',
    regionid: 'texas',
    start_date: '',
    end_date: '',
  });
  const [registrationResults, setRegistrationResults] = useState<
    Execution_Result[]
  >([]);
  const [isRegisteringOutputs, setIsRegisteringOutputs] = useState(false);

  const { accessToken } = useAuth();

  const {
    problemStatements,
    steps,
    currentResult,
    isLoadingProblems,
    createProblemStatement,
    startTranscription,
    resetTranscription,
    transcriptionError,
    isTranscriptionSuccess,
    isCreatingProblem,
    createProblemError,
    // Execution polling
    executions,
    isPolling,
    isExecutionComplete,
    executionError,
    executionSummary,
    hasSuccessfulExecution,
    hasFailedExecution,
    latestExecution,
    startPolling,
    stopPolling,
  } = useTranscription();

  useEffect(() => {
    if (isOpen) {
      resetTranscription();
      setCurrentStep('analysis-type');
      setSelectedAnalysisType('');
      setSelectedProblemStatement(null);
      setConfig({});
      setRegistrationResults([]);
      setIsRegisteringOutputs(false);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isTranscriptionSuccess && currentResult) {
      setCurrentStep('results');
      // Start polling after successful submission
      startPolling();
    }
  }, [isTranscriptionSuccess, currentResult, startPolling]);

  if (!isOpen || !resource) return null;

  const handleSelectAnalysisType = (analysisType: string) => {
    setSelectedAnalysisType(analysisType);
    setCurrentStep('problem-statement');
  };

  const handleSelectProblemStatement = (problemStatement: ProblemStatement) => {
    setSelectedProblemStatement(problemStatement);
    setConfig({
      problemStatementId: problemStatement.id!,
      analysisType: selectedAnalysisType,
      taskName: `Dataset Analysis - ${resource.name}`,
      subtaskName: `${ANALYSIS_TYPES[selectedAnalysisType]?.name} - ${resource.name}`,
    });
    setCurrentStep('configuration');
  };

  const handleCreateProblemStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createProblemStatement({
        name: newProblemStatement.name,
        regionid: newProblemStatement.regionid,
        dates: {
          start_date: newProblemStatement.start_date + 'T00:00:00Z',
          end_date: newProblemStatement.end_date + 'T23:59:59Z',
        },
      });

      setSelectedProblemStatement(created);
      setConfig({
        problemStatementId: created.id!,
        analysisType: selectedAnalysisType,
        taskName: `Dataset Analysis - ${resource.name}`,
        subtaskName: `${ANALYSIS_TYPES[selectedAnalysisType]?.name} - ${resource.name}`,
      });
      setCurrentStep('configuration');
    } catch (error) {
      console.error('Failed to create problem statement:', error);
    }
  };

  const handleStartTranscription = async () => {
    if (!selectedProblemStatement || !config.taskName || !config.subtaskName) {
      return;
    }

    setCurrentStep('progress');

    try {
      await startTranscription({
        resource,
        config: config as TranscriptionConfig,
        problemStatement: selectedProblemStatement,
      });
    } catch (error) {
      console.error('Transcription failed:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      resetTranscription();
      setCurrentStep('analysis-type');
      setSelectedAnalysisType('');
      setSelectedProblemStatement(null);
      setConfig({});
      setRegistrationResults([]);
      setIsRegisteringOutputs(false);
    }, 300);
  };

  const handleRegisterOutputs = async () => {
    if (
      !currentResult ||
      !latestExecution ||
      !selectedProblemStatement ||
      !accessToken
    ) {
      console.error('Missing required data for registering outputs');
      return;
    }

    setIsRegisteringOutputs(true);
    try {
      const results = await dynamoApiService.registerOutputs(
        currentResult.problemStatementId,
        currentResult.taskId,
        currentResult.subtaskId,
        latestExecution.id,
        accessToken,
      );
      setRegistrationResults(results);
      console.log(
        'Outputs registered successfully for execution:',
        latestExecution.id,
        'with',
        results.length,
        'resources',
      );
    } catch (error) {
      console.error('Failed to register outputs:', error);
      setRegistrationResults([]);
    } finally {
      setIsRegisteringOutputs(false);
    }
  };

  const analysisConfig = selectedAnalysisType
    ? ANALYSIS_TYPES[selectedAnalysisType]
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiMic className="w-6 h-6" />
            <h2 className="text-xl font-bold">DYNAMO Analysis</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Analysis Type Selection */}
          {currentStep === 'analysis-type' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Choose Analysis Type:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ANALYSIS_TYPES).map(([key, analysis]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectAnalysisType(key)}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="text-3xl mb-3">{analysis.icon}</div>
                    <h4 className="font-semibold text-lg mb-2">
                      {analysis.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {analysis.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Problem Statement Selection */}
          {currentStep === 'problem-statement' && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setCurrentStep('analysis-type')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">Problem Statement</h3>
              </div>

              {/* Selected Analysis Info */}
              {analysisConfig && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6 flex items-center space-x-4">
                  <div className="text-2xl">{analysisConfig.icon}</div>
                  <div>
                    <h4 className="font-semibold">{analysisConfig.name}</h4>
                    <p className="text-sm opacity-90">
                      {analysisConfig.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Existing Problem Statements */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">
                  Existing Problem Statements:
                </h4>
                {isLoadingProblems ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                      Loading problem statements...
                    </p>
                  </div>
                ) : problemStatements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {problemStatements.map((ps) => (
                      <button
                        key={ps.id}
                        onClick={() => handleSelectProblemStatement(ps)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
                      >
                        <h5 className="font-medium">{ps.name}</h5>
                        <p className="text-sm text-gray-600">
                          Region: {ps.regionid}
                        </p>
                        <p className="text-sm text-gray-600">
                          Period:{' '}
                          {new Date(ps.dates.start_date).toLocaleDateString()} -{' '}
                          {new Date(ps.dates.end_date).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No problem statements found. Create a new one below.
                  </p>
                )}
              </div>

              {/* Create New Problem Statement */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">
                  Create New Problem Statement:
                </h4>
                <form
                  onSubmit={handleCreateProblemStatement}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Problem Name
                    </label>
                    <input
                      type="text"
                      value={newProblemStatement.name}
                      onChange={(e) =>
                        setNewProblemStatement((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Water Management Analysis 2024"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      value={newProblemStatement.regionid}
                      onChange={(e) =>
                        setNewProblemStatement((prev) => ({
                          ...prev,
                          regionid: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="texas">Texas</option>
                      <option value="alaska">Alaska</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={newProblemStatement.start_date}
                        onChange={(e) =>
                          setNewProblemStatement((prev) => ({
                            ...prev,
                            start_date: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newProblemStatement.end_date}
                        onChange={(e) =>
                          setNewProblemStatement((prev) => ({
                            ...prev,
                            end_date: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingProblem}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreatingProblem
                      ? 'Creating...'
                      : 'Create Problem Statement'}
                  </button>

                  {createProblemError && (
                    <p className="text-red-600 text-sm">
                      {createProblemError.message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Configuration */}
          {currentStep === 'configuration' && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setCurrentStep('problem-statement')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold">
                  Analysis Configuration
                </h3>
              </div>

              {/* Selected Analysis Info */}
              {analysisConfig && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-6 flex items-center space-x-4">
                  <div className="text-2xl">{analysisConfig.icon}</div>
                  <div>
                    <h4 className="font-semibold">{analysisConfig.name}</h4>
                    <p className="text-sm opacity-90">
                      {analysisConfig.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={config.taskName || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        taskName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Data Analysis Task"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtask Name
                  </label>
                  <input
                    type="text"
                    value={config.subtaskName || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        subtaskName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Audio Transcription Subtask"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleStartTranscription}
                    disabled={!config.taskName || !config.subtaskName}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Start Analysis
                  </button>
                  <button
                    onClick={() => setCurrentStep('problem-statement')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {currentStep === 'progress' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Analysis Progress</h3>

              <div className="text-center mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your analysis...</p>
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      step.status === 'completed'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : step.status === 'active'
                          ? 'bg-blue-50 border-blue-500 text-blue-800'
                          : step.status === 'error'
                            ? 'bg-red-50 border-red-500 text-red-800'
                            : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}
                  >
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm mt-1">{step.message}</div>
                  </div>
                ))}
              </div>

              {transcriptionError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    <strong>Error:</strong> {transcriptionError.message}
                  </p>
                  <button
                    onClick={() => setCurrentStep('configuration')}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {currentStep === 'results' && currentResult && (
            <div>
              <div className="text-center mb-6">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {analysisConfig?.name} Successfully Submitted!
                </h3>
              </div>

              {/* Execution Status */}
              {(isPolling || executions.length > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${isPolling ? 'bg-blue-500 animate-pulse' : isExecutionComplete ? 'bg-green-500' : 'bg-gray-400'}`}
                    ></div>
                    Execution Status
                  </h4>

                  {isPolling && (
                    <div className="flex items-center mb-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm text-blue-800">
                        Monitoring execution progress...
                      </span>
                    </div>
                  )}

                  {executionSummary.total > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Total Executions:</span>
                        <span className="font-medium">
                          {executionSummary.total}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Running:</span>
                        <span className="font-medium text-blue-600">
                          {executionSummary.running}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed:</span>
                        <span className="font-medium text-green-600">
                          {executionSummary.completed}
                        </span>
                      </div>
                      {executionSummary.failed > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Failed:</span>
                          <span className="font-medium text-red-600">
                            {executionSummary.failed}
                          </span>
                        </div>
                      )}
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Progress:</span>
                          <span className="font-medium">
                            {Math.round(executionSummary.progress * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.round(executionSummary.progress * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {latestExecution && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Latest Status:</span>{' '}
                      {latestExecution.status || 'Unknown'}
                      {latestExecution.run_progress && (
                        <span className="ml-2">
                          ({latestExecution.run_progress * 100} %)
                        </span>
                      )}
                    </div>
                  )}

                  {hasSuccessfulExecution && (
                    <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-md">
                      <p className="text-green-800 text-sm font-medium">
                        ✅ Transcription completed successfully!
                      </p>
                      <button
                        onClick={() => handleRegisterOutputs()}
                        disabled={isRegisteringOutputs}
                        className="mt-2 inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isRegisteringOutputs ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            Registering...
                          </>
                        ) : (
                          <>
                            <FiFileText className="w-3 h-3 mr-1" />
                            Register Outputs
                          </>
                        )}
                      </button>
                      {registrationResults.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                          ✅ Successfully registered{' '}
                          {registrationResults.length} resource
                          {registrationResults.length !== 1 ? 's' : ''} to the
                          data catalog
                        </div>
                      )}
                    </div>
                  )}

                  {hasFailedExecution && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-md">
                      <p className="text-red-800 text-sm font-medium">
                        ❌ Some executions failed. Check the DYNAMO dashboard
                        for details.
                      </p>
                    </div>
                  )}

                  {executionError && (
                    <div className="mt-3 p-3 bg-yellow-100 border border-yellow-200 rounded-md">
                      <p className="text-yellow-800 text-sm font-medium">
                        ⚠️ Monitoring error: {executionError.message}
                      </p>
                    </div>
                  )}

                  {isPolling && (
                    <div className="mt-4">
                      <button
                        onClick={stopPolling}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Stop monitoring
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold mb-4">Analysis Details:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Analysis Type:</strong> {analysisConfig?.name}
                  </div>
                  <div>
                    <strong>Problem Statement ID:</strong>{' '}
                    {currentResult.problemStatementId}
                  </div>
                  <div>
                    <strong>Task ID:</strong> {currentResult.taskId}
                  </div>
                  <div>
                    <strong>Subtask ID:</strong> {currentResult.subtaskId}
                  </div>
                  <div>
                    <strong>Resource:</strong> {resource.name}
                  </div>
                  <div>
                    <strong>Region:</strong> {currentResult.region}
                  </div>
                </div>

                <p className="mt-4 text-gray-700">
                  Your {analysisConfig?.name.toLowerCase()} has been submitted
                  to DYNAMO and is now being processed.
                </p>

                <div className="flex space-x-3 mt-6">
                  <a
                    href={currentResult.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FiExternalLink className="w-4 h-4 mr-2" />
                    View in DYNAMO Dashboard
                  </a>
                  <button
                    onClick={() => alert('Opening execution logs...')}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    <FiFileText className="w-4 h-4 mr-2" />
                    View Execution Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionModal;
