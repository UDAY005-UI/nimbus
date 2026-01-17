import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class InitUploadDto {
  @IsUUID()
  objectId: string | undefined;

  @IsInt()
  @IsPositive()
  totalChunks: number | undefined;

  @IsInt()
  @IsPositive()
  chunkSize: number | undefined;
}
