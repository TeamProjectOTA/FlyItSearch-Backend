// src/app.module.ts
import { Module, ValidationPipe } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AgentsModule } from './agents/agents.module';
import { PaymentModule } from './payment/payment.module';
import { FlightModule } from './flight/flight.module';
import { GoogleOuthModule } from './google-outh/google-outh.module';
import { BookModule } from './book/book.module';
import { HomepageModule } from './homepage/homepage.module';
import { PdfModule } from './pdf/pdf.module';
import { TourpackageModule } from './homepage/tourpackage/tourpackage.module';

import { RateLimitingPipe } from './rate-limiting/rate-limiting.pipe';
import { GoogleOuthController } from './google-outh/google-outh.controller';
import { GoogleOuthService } from './google-outh/google-outh.service';
import { RateLimitingModule } from './ip-address/ip-address.module';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 86400, // 24 hours
        limit: 100, // default limit
      },
    ]),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   synchronize: true ,
    //   logging: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('FLYIT_URL'),
        port: 3306,
        username: configService.get<string>('FLYIT_DB_USERNAME'),
        password: configService.get<string>('FLYIT_DB_PASSWORD'),
        database: configService.get<string>('FLYIT_DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AdminModule,
    UserModule,
    AuthModule,
    MailModule,
    AgentsModule,
    PaymentModule,
    FlightModule,
    GoogleOuthModule,
    BookModule,
    HomepageModule,
    PdfModule,
    TourpackageModule,
    RateLimitingModule, // Ensure this is included
  ],
  controllers: [GoogleOuthController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_PIPE,
      useClass: RateLimitingPipe,
    },
    GoogleOuthService,
  ],
})
export class AppModule {}
