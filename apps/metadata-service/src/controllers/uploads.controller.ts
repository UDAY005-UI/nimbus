import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { UploadsService } from '../services/upload.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('init')
  async initUpload(@Req() req: Request, @Body() body: any) {
    const userId = req.headers['x-user-id'] as string;

    return this.uploadsService.initUpload({
      objectId: body.objectId,
      userId,
      totalChunks: body.totalChunks,
      chunkSize: body.chunkSize,
    });
  }

  @Get(':id')
  async getUpload(@Param('id') id: string) {
    return this.uploadsService.getUploadById(id);
  }

  @Post(':id/complete')
  @HttpCode(200)
  async completeUpload(@Req() req: Request, @Param('id') uploadId: string) {
    return this.uploadsService.completeUpload(uploadId);
  }
}
