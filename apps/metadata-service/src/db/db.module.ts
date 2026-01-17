import { Module } from '@nestjs/common';
import { DbService } from './connection';

@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
