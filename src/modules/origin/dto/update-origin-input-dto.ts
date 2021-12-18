import { PartialType } from '@nestjs/swagger';
import { CreateOriginInput } from './create-origin-input-dto';

export class UpdateOriginInput extends PartialType(CreateOriginInput) {}
