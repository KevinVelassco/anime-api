import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RaceService } from './race.service';
import { Race } from './race.entity';
import { Public } from '../../common/decorators/public.decorator';
import { FindAllRacesInput } from './dto/find-all-races-input.dto';
import { FindOneRaceInput } from './dto/find-one-race-input.dto';
import { CreateRaceInput } from './dto/create-race-input.dto';
import { UpdateRaceInput } from './dto/update-race-input.dto';
import { Admin } from '../../common/decorators/admin.decorator';

@ApiTags('race')
@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Public()
  @Get()
  findAll(@Query() findAllRacesInput: FindAllRacesInput): Promise<any> {
    return this.raceService.findAll(findAllRacesInput);
  }

  @Public()
  @Get(':uid')
  findOne(@Param() findOneRaceInput: FindOneRaceInput): Promise<Race | null> {
    return this.raceService.findOne(findOneRaceInput);
  }

  @Post()
  create(@Body() createRaceInput: CreateRaceInput): Promise<Race> {
    return this.raceService.create(createRaceInput);
  }

  @Put(':uid')
  update(
    @Param() findOneRaceInput: FindOneRaceInput,
    @Body() updateRaceInput: UpdateRaceInput
  ): Promise<Race> {
    return this.raceService.update(findOneRaceInput, updateRaceInput);
  }

  @Admin()
  @Delete(':uid')
  delete(@Param() findOneRaceInput: FindOneRaceInput): Promise<Race> {
    return this.raceService.delete(findOneRaceInput);
  }
}
