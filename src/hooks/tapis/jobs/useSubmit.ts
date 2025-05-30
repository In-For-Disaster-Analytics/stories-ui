import { useMutation } from '@tanstack/react-query';
import {
  JobsApi,
  ReqSubmitJob,
  RespSubmitJob,
} from '@tapis/tapis-typescript-jobs';
import { useTapisConfiguration } from '../useTapisConfiguration';

export const useSubmitJob = () => {
  const configuration = useTapisConfiguration();

  const submitJobRequest = async (
    jobRequest: ReqSubmitJob,
  ): Promise<RespSubmitJob> => {
    const jobsApi = new JobsApi(configuration);
    const response = await jobsApi.submitJob({
      reqSubmitJob: jobRequest,
    });
    return response;
  };

  const mutation = useMutation({
    mutationFn: submitJobRequest,
  });

  return {
    submitJob: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    jobResponse: mutation.data,
  };
};
