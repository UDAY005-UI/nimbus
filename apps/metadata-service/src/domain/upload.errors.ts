export class InvalidUploadStateTransitionError extends Error {
  constructor(from: string, to: string) {
    super(`Invalid upload state transition: ${from} -> ${to}`);
    this.name = 'InvalidUploadStateTransitionError';
  }
}

export class UploadNotFoundError extends Error {
  constructor(uploadId: string) {
    super(`Upload not found: ${uploadId}`);
    this.name = 'UploadNotFoundError';
  }
}
