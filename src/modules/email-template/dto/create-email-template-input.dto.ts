import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TemplateType } from '../email-template.entity';

export class CreateEmailTemplateInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TemplateType, {
    message: () => {
      const keys = Object.keys(TemplateType).filter(x => !(parseInt(x) >= 0));
      return `type must be one of ${keys.join(', ')}`;
    }
  })
  readonly type: TemplateType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly subject: string;
}
