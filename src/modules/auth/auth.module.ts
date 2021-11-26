import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import appConfig from './../../config/app.config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './stratigies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './stratigies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [appConfig.KEY],
      useFactory: (configService: ConfigType<typeof appConfig>) => {
        return {
          secret: configService.app.accessTokenSecret,
          signOptions: {
            expiresIn: '1d'
          }
        };
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
