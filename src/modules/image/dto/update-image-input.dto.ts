import { PartialType } from '@nestjs/swagger';
import { CreateImageInput } from './create-image-input.dto';

export class UpdateImageInput extends PartialType(CreateImageInput) {}
