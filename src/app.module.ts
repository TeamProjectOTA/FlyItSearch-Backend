import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { JwtMiddleware } from './rate-limiter/jwt.middleware';
import { RateLimiterMiddleware } from './rate-limiter/rate-limiter.middleware';
import { IpModule } from './ip/ip.module';
import { APP_GUARD } from '@nestjs/core';
import { TourPackageModule } from './tour-package/tour-package.module';
import { AirportsModule } from './airports/airports.module';
import { AirlinesModule } from './airlines/airlines.module';
import { rootController } from './app.contoller';

require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 15,
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
    IpModule,
    TourPackageModule,
    AirlinesModule,
    AirportsModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [rootController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware, RateLimiterMiddleware)
      //exclude the path that dont use the middle ware
      .exclude(
        { path: 'auth/sign-in-admin', method: RequestMethod.POST },
        { path: 'auth/sign-in-user', method: RequestMethod.POST },
        { path: 'social-site/google', method: RequestMethod.GET },
        { path: 'social-site/google-redirect', method: RequestMethod.GET },
        { path: 'payment/:passengerId', method: RequestMethod.GET },
      )
      .forRoutes(
        // { path: '*', method: RequestMethod.POST },
        { path: '/tour-packages', method: RequestMethod.ALL },
      );
  }
}
