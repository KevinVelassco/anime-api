import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Origin } from './origin.entity';
import { OriginController } from './origin.controller';
import { OriginService } from './origin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Origin])],
  controllers: [OriginController],
  providers: [OriginService],
  exports: [OriginService]
})
export class OriginModule {}
