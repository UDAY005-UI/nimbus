import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DbService } from '../db/connection';
import { withTransaction } from '../db/transaction';
import { UploadsRepository } from '../repositories/upoad.repository';

@Injectable()
export class UploadsService {
  constructor(
    private readonly db: DbService,
    private readonly repo: UploadsRepository,
  ) {}

  async initUpload(params: {
    objectId: string;
    userId: string;
    totalChunks: number;
    chunkSize: number;
  }) {
    return withTransaction(this.db, async (client) => {
      return this.repo.createUpload(client, params);
    });
  }

  async getUploadById(uploadId: string) {
    const upload = await this.repo.getUploadById(uploadId);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }
    return upload;
  }

  async completeUpload(uploadId: string) {
    return withTransaction(this.db, async (client) => {
      const updated = await this.repo.transitionState(
        client,
        uploadId,
        'UPLOADING',
        'PROCESSING',
      );

      if (!updated) {
        throw new ConflictException('Upload is not in UPLOADING state');
      }

      return updated;
    });
  }
}
