import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RaceService } from './race.service';
import { Public } from '../../common/decorators/public.decorator';
import { FindAllRacesInput } from './dto/find-all-races-input.dto';

@ApiTags('race')
@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Public()
  @Get()
  findAll(@Query() findAllRacesInput: FindAllRacesInput): Promise<any> {
    return this.raceService.findAll(findAllRacesInput);
  }
}
