export type UploadState =
  | 'INITIATED'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

const allowedTransitions: Record<UploadState, UploadState[]> = {
  INITIATED: ['UPLOADING', 'FAILED'],
  UPLOADING: ['PROCESSING', 'FAILED'],
  PROCESSING: ['COMPLETED', 'FAILED'],
  COMPLETED: [],
  FAILED: [],
};

export function canTransition(from: UploadState, to: UploadState): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}
