import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';
import { Image } from './image.entity';
import { Public } from '../../common/decorators/public.decorator';
import { UploadFile } from '../../common/interfaces/upload-file.interface';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';
import { FindOneImageInput } from './dto/find-one-image-input.dto';
import { Admin } from '../../common/decorators/admin.decorator';

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

  @Admin()
  @Delete(':uid')
  delete(@Param() findOneImageInput: FindOneImageInput): Promise<Image> {
    return this.imageService.delete(findOneImageInput);
  }

  @Admin()
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadImages(@UploadedFiles() files: Array<UploadFile>): Promise<Image[]> {
    return this.imageService.uploadImages(files);
  }
}
