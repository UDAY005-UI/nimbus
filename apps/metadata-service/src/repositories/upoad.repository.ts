import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DbService } from '../db/connection';

@Injectable()
export class UploadsRepository {
  constructor(private readonly db: DbService) {}

  async createUpload(
    client: PoolClient,
    params: {
      objectId: string;
      userId: string;
      totalChunks: number;
      chunkSize: number;
    },
  ) {
    const { objectId, userId, totalChunks, chunkSize } = params;

    const result = await client.query(
      `
            INSERT INTO uploads (
            object_id,
            initiated_by_user_id,
            state,
            total_chunks,
            chunk_size
            )
            VALUES ($1, $2, 'INITIATED', $3, $4)
            RETURNING *
            `,
      [objectId, userId, totalChunks, chunkSize],
    );

    return result.rows[0];
  }

  async transitionState(
    client: PoolClient,
    uploadId: string,
    fromState: string,
    toState: string,
  ) {
    const result = await client.query(
      `
            UPDATE uploads
            SET state = $2
            WHERE id = $1
                AND state = $3
                RETURNING *
                `,
      [uploadId, toState, fromState],
    );

    return result.rows[0] ?? null;
  }

  async getUploadById(uploadId: string) {
    const result = await this.db.query(`SELECT * FROM uploads WHERE id = $1`, [
      uploadId,
    ]);
    return result.rows[0] ?? null;
  }
}
