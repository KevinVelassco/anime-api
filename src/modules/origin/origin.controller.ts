import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Origin } from './origin.entity';
import { OriginService } from './origin.service';
import { Public } from '../../common/decorators/public.decorator';
import { FindOneOriginInput } from './dto/find-one-origin-input.dto';
import { FindAllOriginsInput } from './dto/find-all-origins-input.dto';

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
}
