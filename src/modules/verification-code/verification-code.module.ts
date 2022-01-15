import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VerificationCode } from './verification-code.entity';
import { VerificationCodeService } from './verification-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode])],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService]
})
export class VerificationCodeModule {}
