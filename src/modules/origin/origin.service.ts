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
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { ILike, Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';

import appConfig from '../../config/app.config';
import { Origin } from './origin.entity';
import { FindOneOriginInput } from './dto/find-one-origin-input.dto';
import { FindAllOriginsInput } from './dto/find-all-origins-input.dto';
import { CreateOriginInput } from './dto/create-origin-input-dto';
import { UploadFile } from '../../common/interfaces/upload-file.interface';
import { UpdateOriginInput } from './dto/update-origin-input-dto';

@Injectable()
export class OriginService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(Origin)
    private readonly originRepository: Repository<Origin>
  ) {
    cloudinary.config({
      cloud_name: this.appConfiguration.cloudinary.cloudName,
      api_key: this.appConfiguration.cloudinary.apiKey,
      api_secret: this.appConfiguration.cloudinary.apiSecret
    });
  }

  public async findAll(findAllOriginsInput: FindAllOriginsInput): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllOriginsInput;

    let where: any;

    if (q) where = { name: ILike(`%${q}%`) };

    const items = await this.originRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }

  public async findOne(
    findOneOriginInput: FindOneOriginInput
  ): Promise<Origin | null> {
    const { uid, checkIfExists = false } = findOneOriginInput;

    const item = await this.originRepository.findOne({ where: { uid } });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the origin with uuid ${uid}.`);
    }

    return item || null;
  }

  public async create(
    createOriginInput: CreateOriginInput,
    file: UploadFile
  ): Promise<Origin> {
    if (!file) throw new BadRequestException('file is required.');

    const { name } = createOriginInput;

    const existingByName = await this.originRepository
      .createQueryBuilder('o')
      .where('upper(o.name) = upper(:name)', { name })
      .getOne();

    if (existingByName) {
      throw new ConflictException(`already exists a origin with name ${name}`);
    }

    let filePath = '';

    try {
      const { originalname, mimetype } = file;

      if (!mimetype.startsWith('image')) {
        throw new BadRequestException('mimetype not allowed.');
      }

      const basePath = path.resolve(__dirname);

      const fileExtension = originalname.split('.').pop();

      const fileName = name.trim().split(' ').join('_');

      filePath = `${basePath}/${fileName}.${fileExtension}`;

      fs.writeFileSync(filePath, file.buffer);

      const folderName =
        this.appConfiguration.environment === 'production'
          ? 'origins'
          : `${this.appConfiguration.environment}_origins`;

      const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
        folder: folderName,
        public_id: '' + fileName,
        use_filename: true,
        quality: 'auto:best'
      });

      const { public_id: cloudId, secure_url: image } = cloudinaryResponse;

      const created = this.originRepository.create({ name, image, cloudId });

      const saved = await this.originRepository.save(created);

      return saved;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  public async update(
    findOneOriginInput: FindOneOriginInput,
    updateOriginInput: UpdateOriginInput,
    file: UploadFile
  ): Promise<Origin> {
    const existing = await this.findOne({
      ...findOneOriginInput,
      checkIfExists: true
    });

    const { name } = updateOriginInput;

    if (name) {
      const existingByName = await this.originRepository
        .createQueryBuilder('o')
        .where('upper(o.name) = upper(:name)', { name })
        .getOne();

      if (existingByName) {
        throw new ConflictException(
          `already exists a origin with name ${name}`
        );
      }
    }

    let cloudId, image;

    let folderName =
      this.appConfiguration.environment === 'production'
        ? 'origins'
        : `${this.appConfiguration.environment}_origins`;

    if (name && !file) {
      try {
        const fileName = existing.name.trim().split(' ').join('_');
        const renamedFileName = name.trim().split(' ').join('_');

        const cloudinaryResponse = await cloudinary.uploader.rename(
          `${folderName}/${fileName}`,
          `${folderName}/${renamedFileName}`
        );

        const { public_id, secure_url } = cloudinaryResponse;

        cloudId = public_id;
        image = secure_url;
      } catch (error) {
        throw new ConflictException(
          'Something is wrong with the image name change!'
        );
      }
    }

    if (file) {
      let filePath = '';

      try {
        const { originalname, mimetype } = file;

        if (!mimetype.startsWith('image')) {
          throw new BadRequestException('mimetype not allowed.');
        }

        const basePath = path.resolve(__dirname);

        const fileExtension = originalname.split('.').pop();

        const fileName = existing.name.trim().split(' ').join('_');

        filePath = `${basePath}/${fileName}.${fileExtension}`;

        fs.writeFileSync(filePath, file.buffer);

        let cloudinaryResponse;

        cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
          folder: folderName,
          public_id: '' + fileName,
          use_filename: true,
          quality: 'auto:best'
        });

        if (name) {
          const renamedFileName = name.trim().split(' ').join('_');

          cloudinaryResponse = await cloudinary.uploader.rename(
            `${folderName}/${fileName}`,
            `${folderName}/${renamedFileName}`
          );
        }

        const { public_id, secure_url } = cloudinaryResponse;

        cloudId = public_id;
        image = secure_url;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      } finally {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const preloaded = await this.originRepository.preload({
      id: existing.id,
      ...updateOriginInput,
      cloudId,
      image
    });

    const saved = await this.originRepository.save(preloaded);

    return saved;
  }
}
