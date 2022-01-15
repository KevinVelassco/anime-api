import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FindAllEmailTemplatesInput {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly skip?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly q?: string;
}
