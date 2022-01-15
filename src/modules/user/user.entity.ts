import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { VerificationCode } from '../verification-code/verification-code.entity';

@Entity('users')
@Unique('uq_user_auth_uid', ['authUid'])
@Unique('uq_user_email', ['email'])
export class User {
  @Exclude()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'auth_uid' })
  @Generated('uuid')
  authUid: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Exclude()
  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @ApiProperty()
  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @OneToMany(
    () => VerificationCode,
    (verificationCode: VerificationCode) => verificationCode.user
  )
  verificationCodes: VerificationCode[];
}
