import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Image } from './image.entity';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {}

  public async findAll(findAllImagesInput: FindAllImagesInput): Promise<any> {
    const { limit = 10, skip = 0 } = findAllImagesInput;

    const items = await this.imageRepository.findAndCount({
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }
}
