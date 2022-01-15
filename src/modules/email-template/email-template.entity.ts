import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

export enum TemplateType {
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  CONFIRMATION_EMAIL = 'CONFIRMATION_EMAIL',
  RESET_PASSWORD_EMAIL = 'RESET_PASSWORD_EMAIL',
  PASSWORD_UPDATED_EMAIL = 'PASSWORD_UPDATED_EMAIL',
  EMAIL_CHANGE_NOTIFICATION_EMAIL = 'EMAIL_CHANGE_NOTIFICATION_EMAIL'
}

@Entity('email_templates')
@Unique('uq_email_template_uid', ['uid'])
@Unique('uq_email_template_type', ['type'])
export class EmailTemplate {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Generated('uuid')
  @Column()
  uid: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: TemplateType
  })
  type: TemplateType;

  @Exclude()
  @ApiProperty()
  @Column({
    type: 'bytea',
    nullable: true
  })
  file: Buffer;

  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
