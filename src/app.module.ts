import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import appConfig from './config/app.config';
import appConfigSchema from './config/app.config.schema';

import { CharacterModule } from './modules/character/character.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ImageModule } from './modules/image/image.module';
import { AssignedImageModule } from './modules/assigned-image/assigned-image.module';
import { RaceModule } from './modules/race/race.module';
import { OriginModule } from './modules/origin/origin.module';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { EmailTemplateModule } from './modules/email-template/email-template.module';

const NODE_ENV = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `../.env.${NODE_ENV}`);

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigSchema
    }),

    // TypeORM
    TypeOrmModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (configService: ConfigType<typeof appConfig>) => {
        return {
          type: 'postgres',
          host: configService.database.host,
          port: configService.database.port,
          username: configService.database.user,
          password: configService.database.password,
          database: configService.database.database,
          autoLoadEntities: true,
          synchronize: false,
          logging: configService.database.log === 'yes'
        };
      }
    }),

    CommonModule,
    AuthModule,
    UserModule,
    CharacterModule,
    ImageModule,
    AssignedImageModule,
    RaceModule,
    OriginModule,
    VerificationCodeModule,
    EmailTemplateModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
