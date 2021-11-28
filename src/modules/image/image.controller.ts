import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ImageService } from './image.service';
import { Image } from './image.entity';
import { Public } from '../../common/decorators/public.decorator';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';
import { FindOneImageInput } from './dto/find-one-image-input.dto';
import { CreateImageInput } from './dto/create-image-input.dto';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Get()
  findAll(@Query() findAllImagesInput: FindAllImagesInput): Promise<any> {
    return this.imageService.findAll(findAllImagesInput);
  }

  @Public()
  @Get(':uid')
  findOne(
    @Param() findOneImageInput: FindOneImageInput
  ): Promise<Image | null> {
    return this.imageService.findOne(findOneImageInput);
  }

  @Post()
  create(@Body() createImageInput: CreateImageInput): Promise<Image> {
    return this.imageService.create(createImageInput);
  }
}
