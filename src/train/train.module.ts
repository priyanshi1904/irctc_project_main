import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';

@Module({
  providers: [TrainService],
  controllers: [TrainController],
})
export class TrainModule {}
