"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const admin_module_1 = require("./admin/admin.module");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const agents_module_1 = require("./agents/agents.module");
const payment_module_1 = require("./payment/payment.module");
const flight_module_1 = require("./flight/flight.module");
const homepage_module_1 = require("./homepage/homepage.module");
const ip_module_1 = require("./ip/ip.module");
const core_1 = require("@nestjs/core");
const tour_package_module_1 = require("./tour-package/tour-package.module");
const airports_module_1 = require("./airports/airports.module");
const airlines_module_1 = require("./airlines/airlines.module");
const booking_module_1 = require("./book/booking.module");
const uploads_module_1 = require("./uploads/uploads.module");
const terms_and_conditions_module_1 = require("./terms-and-conditions/terms-and-conditions.module");
const deposit_module_1 = require("./deposit/deposit.module");
const travel_buddy_module_1 = require("./travel-buddy/travel-buddy.module");
const transection_module_1 = require("./transection/transection.module");
const admin_dashboard_module_1 = require("./admin-dashboard/admin-dashboard.module");
const bank_add_module_1 = require("./bank-add/bank-add.module");
const schedule_1 = require("@nestjs/schedule");
const shedule_module_1 = require("./shedule/shedule.module");
const whitelist_module_1 = require("./whitelist/whitelist.module");
const jwt_middleware_1 = require("./rate-limiter/jwt.middleware");
const rate_limiter_middleware_1 = require("./rate-limiter/rate-limiter.middleware");
const hotel_module_1 = require("./hotel/hotel.module");
const visa_module_1 = require("./visa/visa.module");
require('dotenv').config();
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(jwt_middleware_1.JwtMiddleware, rate_limiter_middleware_1.RateLimiterMiddleware)
            .exclude({ path: 'auth/sign-in-admin', method: common_1.RequestMethod.POST }, { path: 'auth/sign-in-user', method: common_1.RequestMethod.POST }, { path: 'social-site/google', method: common_1.RequestMethod.GET }, { path: 'social-site/google-redirect', method: common_1.RequestMethod.GET })
            .forRoutes({ path: '/flights/fhb/airSearch', method: common_1.RequestMethod.POST });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 20,
                },
            ]),
            typeorm_1.TypeOrmModule.forRoot({
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
            schedule_1.ScheduleModule.forRoot(),
            admin_module_1.AdminModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            agents_module_1.AgentsModule,
            payment_module_1.PaymentModule,
            flight_module_1.FlightModule,
            booking_module_1.BookingModule,
            homepage_module_1.HomepageModule,
            ip_module_1.IpModule,
            tour_package_module_1.TourPackageModule,
            airlines_module_1.AirlinesModule,
            airports_module_1.AirportsModule,
            uploads_module_1.UploadsModule,
            terms_and_conditions_module_1.TermsAndConditionsModule,
            deposit_module_1.DepositModule,
            travel_buddy_module_1.TravelBuddyModule,
            transection_module_1.TransectionModule,
            admin_dashboard_module_1.AdminDashboardModule,
            bank_add_module_1.BankAddModule,
            shedule_module_1.SheduleModule,
            whitelist_module_1.WhitelistModule,
            hotel_module_1.HotelModule,
            visa_module_1.VisaModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
        controllers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map