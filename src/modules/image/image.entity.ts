import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { AssignedImage } from '../assigned-image/assigned-image.entity';

@Entity('images')
@Unique('uq_image_uid', ['uid'])
@Unique('uq_image_url', ['url'])
export class Image {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  uid: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 400 })
  url: string;

  @ApiProperty()
  @Column({ name: 'cloud_id', type: 'varchar', length: 50, nullable: true })
  cloudId?: string;

  @Exclude()
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(
    () => AssignedImage,
    (assignedImage: AssignedImage) => assignedImage.image
  )
  assignedImages: AssignedImage[];
}
