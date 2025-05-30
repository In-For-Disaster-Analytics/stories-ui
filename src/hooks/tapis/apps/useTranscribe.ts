import { useSubmitJob } from '../jobs/useSubmit';
import { ReqSubmitJob } from '@tapis/tapis-typescript-jobs';

interface TranscribeJobParams {
  audioFileUrl: string;
  minSpeakers?: number;
}

export const useTranscribe = () => {
  const { submitJob, isLoading, error, jobResponse } = useSubmitJob();

  const transcribe = async ({
    audioFileUrl,
    minSpeakers = 1,
  }: TranscribeJobParams) => {
    const jobRequest: ReqSubmitJob = {
      name: `whisper-transcription-${Date.now()}`,
      appId: 'whisper-transcription',
      appVersion: '05d5814',
      description: 'Whisper transcription job',
      execSystemId: 'ls6',
      execSystemLogicalQueue: 'gpu-a100-small',
      nodeCount: 1,
      coresPerNode: 1,
      memoryMB: 1000,
      maxMinutes: 40,
      fileInputs: [
        {
          name: 'Audio File',
          sourceUrl: audioFileUrl,
          targetPath: 'source.audio',
          description: 'Audio file to transcribe',
          autoMountLocal: true,
        },
      ],
      parameterSet: {
        appArgs: [
          {
            name: 'min_speakers',
            arg: minSpeakers.toString(),
            description: 'Minimum number of speakers.',
          },
        ],
        logConfig: {
          stderrFilename: 'tapisjob.out',
          stdoutFilename: 'tapisjob.out',
        },
        schedulerOptions: [
          {
            arg: '-A PT2050-DataX',
            name: 'TACC Allocation',
            include: true,
            description:
              'The TACC allocation associated with this job execution',
          },
        ],
      },
      archiveSystemId: 'cloud.data',
      archiveOnAppError: true,
      tags: ['portalName: PTDATAX'],
    };
    console.log(jobRequest);
    return submitJob(jobRequest);
  };

  return {
    transcribe,
    isLoading,
    error,
    jobResponse,
  };
};
