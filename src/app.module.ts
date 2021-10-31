import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from './modules/anime/anime.module';
import { CharacterModule } from './modules/character/character.module';
import appConfig from './config/app.config';
import appConfigSchema from './config/app.config.schema';

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
          synchronize: configService.environment !== 'production',
          logging: configService.database.log === 'yes'
        };
      }
    }),

    AnimeModule,
    CharacterModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
