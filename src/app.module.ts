import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AgentsModule } from './agents/agents.module';
import { PaymentModule } from './payment/payment.module';
import { FlightModule } from './flight/flight.module';
import { GoogleOuthService } from './google-outh/google-outh.service';
import { GoogleOuthController } from './google-outh/google-outh.controller';
import { GoogleOuthModule } from './google-outh/google-outh.module';
import { BookModule } from './book/book.module';
import { HomepageModule } from './homepage/homepage.module';
import { PdfModule } from './pdf/pdf.module';
import { TourpackageModule } from './homepage/tourpackage/tourpackage.module';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        limit: 10,
        ttl: 6000,
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
    //   synchronize: false ,
    //   logging: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_URL'),
        port: 3306,
        username: configService.get<string>('DB_AWS_NAME'),
        password: configService.get<string>('DB_AWS_PASSWORD'),
        database: configService.get<string>('DB_AWS_DBNAME'),
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
    TourpackageModule
  ],
  controllers: [GoogleOuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    GoogleOuthService,
  ],
})
export class AppModule {}
