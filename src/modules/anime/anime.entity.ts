import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity('animes')
@Unique('uq_uid', ['uid'])
@Unique('uq_name', ['name'])
export class Anime {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uid: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
