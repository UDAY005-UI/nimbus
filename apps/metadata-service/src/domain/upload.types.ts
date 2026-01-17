import { UploadState } from './upload-state.machine';

export interface Upload {
  id: string;
  objectId: string;
  initiatedByUserId: string;
  state: UploadState;
  totalChunks: number;
  chunkSize: number;
  createdAt: Date;
  completedAt?: Date;
}
