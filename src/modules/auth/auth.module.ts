import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { MailgunModule } from '../../common/plugins/mailgun/mailgun.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './stratigies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { JwtRefreshStrategy } from './stratigies/jwt-refresh.strategy';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { JwtVerifyStrategy } from './stratigies/jwt-verify.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
    UserModule,
    MailgunModule,
    EmailTemplateModule,
    VerificationCodeModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtVerifyStrategy
  ]
})
export class AuthModule {}
