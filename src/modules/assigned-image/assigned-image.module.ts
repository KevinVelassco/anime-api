import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AssignedImage } from './assigned-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssignedImage])]
})
export class AssignedImageModule {}
