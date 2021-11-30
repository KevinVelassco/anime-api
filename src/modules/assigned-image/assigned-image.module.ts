import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CharacterModule } from '../character/character.module';
import { ImageModule } from '../image/image.module';
import { AssignedImageController } from './assigned-image.controller';
import { AssignedImage } from './assigned-image.entity';
import { AssignedImageService } from './assigned-image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignedImage]),
    CharacterModule,
    ImageModule
  ],
  controllers: [AssignedImageController],
  providers: [AssignedImageService]
})
export class AssignedImageModule {}
