import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { MailgunModule } from '../../common/plugins/mailgun/mailgun.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    VerificationCodeModule,
    EmailTemplateModule,
    MailgunModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
