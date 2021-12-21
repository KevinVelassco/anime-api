import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Origin } from './origin.entity';
import { OriginService } from './origin.service';
import { Public } from '../../common/decorators/public.decorator';
import { FindOneOriginInput } from './dto/find-one-origin-input.dto';
import { FindAllOriginsInput } from './dto/find-all-origins-input.dto';
import { UploadFile } from '../../common/interfaces/upload-file.interface';
import { CreateOriginInput } from './dto/create-origin-input-dto';
import { UpdateOriginInput } from './dto/update-origin-input-dto';
import { Admin } from '../../common/decorators/admin.decorator';

@ApiTags('origin')
@Controller('origin')
export class OriginController {
  constructor(private readonly originService: OriginService) {}

  @Public()
  @Get()
  findAll(@Query() findAllOriginsInput: FindAllOriginsInput): Promise<any> {
    return this.originService.findAll(findAllOriginsInput);
  }

  @Public()
  @Get(':uid')
  findOne(
    @Param() findOneOriginInput: FindOneOriginInput
  ): Promise<Origin | null> {
    return this.originService.findOne(findOneOriginInput);
  }

  @Admin()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createOriginInput: CreateOriginInput,
    @UploadedFile() file: UploadFile
  ): Promise<Origin> {
    return this.originService.create(createOriginInput, file);
  }

  @Admin()
  @Put(':uid')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param() findOneOriginInput: FindOneOriginInput,
    @Body() updateOriginInput: UpdateOriginInput,
    @UploadedFile() file: UploadFile
  ): Promise<Origin> {
    return this.originService.update(
      findOneOriginInput,
      updateOriginInput,
      file
    );
  }

  @Admin()
  @Delete(':uid')
  delete(@Param() findOneOriginInput: FindOneOriginInput): Promise<Origin> {
    return this.originService.delete(findOneOriginInput);
  }
}
