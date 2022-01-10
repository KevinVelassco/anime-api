import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './stratigies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { JwtRefreshStrategy } from './stratigies/jwt-refresh.strategy';

@Module({
  imports: [PassportModule, UserModule, JwtModule.register({})],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
