import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enabling for cors policy
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true /*Ignora los atributos que no esten definidos en el DTO*/,
      forbidNonWhitelisted:
        true /*Alertar de un error al cliente cuando se envie un atributo no definido en el DTO*/,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Serializar - sirve para transformar la información antes de retórnala
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Anime Api')
    .setDescription('Anime Api')
    .setVersion('1.0')
    //.addTag('anime')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('config.app.port');

  await app.listen(PORT);
}
bootstrap();
