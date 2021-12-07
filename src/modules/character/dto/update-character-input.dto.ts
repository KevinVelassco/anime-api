import { PartialType } from '@nestjs/swagger';
import { CreateCharacterInput } from './create-character-input.dto';

export class UpdateCharacterInput extends PartialType(CreateCharacterInput) {}
