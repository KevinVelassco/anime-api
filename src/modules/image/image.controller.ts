import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ImageService } from './image.service';
import { Public } from '../../common/decorators/public.decorator';
import { FindAllImagesInput } from './dto/find-all-images-input.dto';

@ApiTags('image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Get()
  findAll(@Query() findAllImagesInput: FindAllImagesInput): Promise<any> {
    return this.imageService.findAll(findAllImagesInput);
  }
}
