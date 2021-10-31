import { ApiProperty } from '@nestjs/swagger';

export class Anime {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  name: string;
}
