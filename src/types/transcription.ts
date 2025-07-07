export interface TranscriptionSegment {
  speaker: string;
  timestamp: [number, number]; // [start, end] in seconds
  text: string;
  annotation?: string; // Optional annotation for the segment
}

export interface TranscriptionSpeaker {
  speaker: string;
  timestamp: [number, number];
  text: string;
}

export interface TranscriptionChunk {
  timestamp: [number, number];
  text: string;
}

export interface TranscriptionData {
  speakers: TranscriptionSpeaker[];
  chunks: TranscriptionChunk[];
  text: string;
}

export interface TranscriptionEditorConfig {
  maxCPS: number; // Maximum characters per second threshold
}

export interface TranscriptionEditAction {
  type: 'add' | 'delete' | 'split' | 'edit';
  segmentIndex: number;
  newSegment?: TranscriptionSegment;
  splitTime?: number;
}