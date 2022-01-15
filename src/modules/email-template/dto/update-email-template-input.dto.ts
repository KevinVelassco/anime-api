import { PartialType } from '@nestjs/swagger';
import { CreateEmailTemplateInput } from './create-email-template-input.dto';

export class UpdateEmailTemplateInput extends PartialType(
  CreateEmailTemplateInput
) {}
