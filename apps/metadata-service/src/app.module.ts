import { Module } from '@nestjs/common';
import { UploadsController } from './controllers/uploads.controller';
import { UploadsService } from './services/upload.service';
import { UploadsRepository } from './repositories/upoad.repository';
import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsRepository],
})
export class AppModule {}
