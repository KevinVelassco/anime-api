import * as fs from 'fs';
import * as path from 'path';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';

import appConfig from '../../config/app.config';
import { generateUuid } from '../../utils';
import { Image } from './image.entity';
import { UploadFile } from '../../common/interfaces/upload-file.interface';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';
import { FindOneImageInput } from './dto/find-one-image-input.dto';

@Injectable()
export class ImageService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {
    cloudinary.config({
      cloud_name: this.appConfiguration.cloudinary.cloudName,
      api_key: this.appConfiguration.cloudinary.apiKey,
      api_secret: this.appConfiguration.cloudinary.apiSecret
    });
  }

  public async findAll(findAllImagesInput: FindAllImagesInput): Promise<any> {
    const { limit = 10, skip = 0 } = findAllImagesInput;

    const [images, imagesCount] = await this.imageRepository.findAndCount({
      take: limit,
      skip,
      order: {
        id: 'DESC'
      },
      relations: ['assignedImages', 'assignedImages.character']
    });

    const items = images.map(({ uid, url, assignedImages }) => {
      const character = assignedImages.map(
        assignedImage => assignedImage.character
      );
      return { uid, url, character };
    });

    return [items, imagesCount];
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

  public async delete(findOneImageInput: FindOneImageInput): Promise<Image> {
    const { uid } = findOneImageInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    try {
      const { result } = await cloudinary.uploader.destroy(existing.cloudId);

      if (result !== 'ok') throw new ConflictException();
    } catch (error) {
      throw new ConflictException(
        'Something is wrong with deleting the image!'
      );
    }

    const deleted = await this.imageRepository.remove(existing);

    return deleted;
  }

  public async uploadImages(files: Array<UploadFile>): Promise<Image[]> {
    if (!files.length) throw new BadRequestException('file is required.');

    const isImageFile = files.every(({ mimetype }) =>
      mimetype.startsWith('image')
    );

    if (!isImageFile) {
      throw new BadRequestException('mimetype not allowed.');
    }

    const folderName =
      this.appConfiguration.environment === 'production'
        ? 'images'
        : `${this.appConfiguration.environment}_images`;

    let images: Image[] = [];

    for (let file of files) {
      let filePath = '';

      try {
        const { originalname } = file;

        const basePath = path.resolve(__dirname);

        const fileExtension = originalname.split('.').pop();

        const uid = generateUuid(21);

        filePath = `${basePath}/${uid}.${fileExtension}`;

        fs.writeFileSync(filePath, file.buffer);

        const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
          folder: folderName,
          public_id: '' + uid,
          use_filename: true,
          quality: 'auto:best'
        });

        const { public_id: cloudId, secure_url: url } = cloudinaryResponse;

        const created = this.imageRepository.create({ uid, url, cloudId });

        images.push(created);
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      } finally {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const saved = await this.imageRepository.save(images);

    return saved;
  }
}
