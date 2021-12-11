import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Origin } from './origin.entity';
import { OriginService } from './origin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Origin])],
  providers: [OriginService],
  exports: [OriginService]
})
export class OriginModule {}
