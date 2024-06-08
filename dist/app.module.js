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
const user_module_1 = require("./user/user.module");
const admin_module_1 = require("./admin/admin.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const agents_module_1 = require("./agents/agents.module");
const payment_module_1 = require("./payment/payment.module");
const flight_module_1 = require("./flight/flight.module");
const google_outh_service_1 = require("./google-outh/google-outh.service");
const google_outh_controller_1 = require("./google-outh/google-outh.controller");
const google_outh_module_1 = require("./google-outh/google-outh.module");
const book_module_1 = require("./book/book.module");
const homepage_module_1 = require("./homepage/homepage.module");
const pdf_module_1 = require("./pdf/pdf.module");
const tourpackage_module_1 = require("./homepage/tourpackage/tourpackage.module");
require('dotenv').config();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    limit: 10,
                    ttl: 6000,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('FLYIT_URL'),
                    port: 3306,
                    username: configService.get('FLYIT_DB_USERNAME'),
                    password: configService.get('FLYIT_DB_PASSWORD'),
                    database: configService.get('FLYIT_DB_NAME'),
                    autoLoadEntities: true,
                    synchronize: false,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            admin_module_1.AdminModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            mail_module_1.MailModule,
            agents_module_1.AgentsModule,
            payment_module_1.PaymentModule,
            flight_module_1.FlightModule,
            google_outh_module_1.GoogleOuthModule,
            book_module_1.BookModule,
            homepage_module_1.HomepageModule,
            pdf_module_1.PdfModule,
            tourpackage_module_1.TourpackageModule,
        ],
        controllers: [google_outh_controller_1.GoogleOuthController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            google_outh_service_1.GoogleOuthService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map