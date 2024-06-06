import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //app.useStaticAssets(join(__dirname, '..', 'uploads'));
  /*
  const allowedIP = ('192.168.10.30')
  app.enableCors({
    origin: (origin, callback) => {
      if (origin === allowedIP) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })*/

  const config = new DocumentBuilder()
    .setTitle('Flight')
    .setDescription('Flight api description')
    .setVersion('2.0')
    .addTag('flight')
    .addSecurityRequirements('token')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'access_token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
