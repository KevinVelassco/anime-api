import { PartialType } from '@nestjs/swagger';
import { CreateRaceInput } from './create-race-input.dto';

export class UpdateRaceInput extends PartialType(CreateRaceInput) {}
