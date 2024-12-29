import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';



dotenv.config();

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
    .setVersion('1.0')
    .addTag('Flight-API')
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
  // app.use(bodyParser.json({ limit: '50mb' })); //document size increased
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const port = 8080;
 
  await app.listen(port);
}
bootstrap();
