import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { Character } from '../character/character.entity';
import { Image } from '../image/image.entity';

@Entity('assigned_images')
@Unique('uq_assigned_image_uid', ['uid'])
@Unique('uq_assigned_image', ['character', 'image'])
export class AssignedImage {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uid: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(
    () => Character,
    (character: Character) => character.assignedImages,
    {
      nullable: false
    }
  )
  @JoinColumn({ name: 'character_id' })
  character: Character;

  @ManyToOne(() => Image, (image: Image) => image.assignedImages, {
    nullable: false
  })
  @JoinColumn({ name: 'image_id' })
  image: Image;
}
