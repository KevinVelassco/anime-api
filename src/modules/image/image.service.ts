import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Image } from './image.entity';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';
import { FindOneImageInput } from './dto/find-one-image-input.dto';
import { CreateImageInput } from './dto/create-image-input.dto';

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

  public async findOne(
    findOneImageInput: FindOneImageInput
  ): Promise<Image | null> {
    const { uid, checkIfExists = false } = findOneImageInput;

    const item = await this.imageRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the image with uuid ${uid}.`);
    }

    return item || null;
  }

  public async create(createImageInput: CreateImageInput): Promise<Image> {
    const { url } = createImageInput;

    const existingByUrl = await this.imageRepository
      .createQueryBuilder('i')
      .where('i.url = :url', { url })
      .getOne();

    if (existingByUrl) {
      throw new ConflictException(`already exists a image with url ${url}`);
    }

    const created = this.imageRepository.create(createImageInput);
    const saved = await this.imageRepository.save(created);
    return saved;
  }
}
