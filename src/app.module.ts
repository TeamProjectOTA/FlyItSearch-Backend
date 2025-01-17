import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AgentsModule } from './agents/agents.module';
import { PaymentModule } from './payment/payment.module';
import { FlightModule } from './flight/flight.module';
import { HomepageModule } from './homepage/homepage.module';
import { IpModule } from './ip/ip.module';
import { APP_GUARD } from '@nestjs/core';
import { TourPackageModule } from './tour-package/tour-package.module';
import { AirportsModule } from './airports/airports.module';
import { AirlinesModule } from './airlines/airlines.module';
import { BookingModule } from './book/booking.module';
import { UploadsModule } from './uploads/uploads.module';
import { TermsAndConditionsModule } from './terms-and-conditions/terms-and-conditions.module';
import { DepositModule } from './deposit/deposit.module';
import { TravelBuddyModule } from './travel-buddy/travel-buddy.module';
import { TransectionModule } from './transection/transection.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { BankAddModule } from './bank-add/bank-add.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SheduleModule } from './shedule/shedule.module';
import { WhitelistModule } from './whitelist/whitelist.module';
import { JwtMiddleware } from './rate-limiter/jwt.middleware';
import { RateLimiterMiddleware } from './rate-limiter/rate-limiter.middleware';
import { HotelModule } from './hotel/hotel.module';
import { VisaModule } from './visa/visa.module';
require('dotenv').config();

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20,
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
    //   synchronize: true,
    //   logging: false,
    //   timezone: 'Z',
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.FLYIT_URL,
      port: 3306,
      username: process.env.FLYIT_DB_USERNAME,
      password: process.env.FLYIT_DB_PASSWORD,
      database: process.env.FLYIT_DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      connectTimeout: 60000,
      logging: false,
      timezone: 'Z',
    }),
    ScheduleModule.forRoot(),
    AdminModule,
    UserModule,
    AuthModule,
    MailModule,
    AgentsModule,
    PaymentModule,
    FlightModule,
    BookingModule,
    HomepageModule,
    IpModule,
    TourPackageModule,
    AirlinesModule,
    AirportsModule,
    UploadsModule,
    TermsAndConditionsModule,
    DepositModule,
    TravelBuddyModule,
    TransectionModule,
    AdminDashboardModule,
    BankAddModule,
    SheduleModule,
    WhitelistModule,
    HotelModule,
    VisaModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [],
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
      )
      .forRoutes(
        //{ path: '*', method: RequestMethod.ALL },
        // include all the path that uses this middleware
        { path: '/flights/fhb/airSearch', method: RequestMethod.POST },
      );
  }
}
