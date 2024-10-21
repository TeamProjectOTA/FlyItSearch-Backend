"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightModule = void 0;
const common_1 = require("@nestjs/common");
const flight_controller_1 = require("./flight.controller");
const flight_service_1 = require("./flight.service");
const typeorm_1 = require("@nestjs/typeorm");
const flight_model_1 = require("./flight.model");
const airports_module_1 = require("../airports/airports.module");
const airlines_module_1 = require("../airlines/airlines.module");
const axios_1 = require("@nestjs/axios");
const bdfare_flights_service_1 = require("./API Utils/bdfare.flights.service");
const sabre_utils_1 = require("./API Utils/sabre.utils");
const sabre_flights_service_1 = require("./API Utils/sabre.flights.service");
const flyhub_flight_service_1 = require("./API Utils/flyhub.flight.service");
const flyhub_util_1 = require("./API Utils/flyhub.util");
const test_service_1 = require("./API Utils/test.service");
const admin_entity_1 = require("../admin/entities/admin.entity");
const auth_module_1 = require("../auth/auth.module");
const user_entity_1 = require("../user/entities/user.entity");
const booking_model_1 = require("../book/booking.model");
const booking_service_1 = require("../book/booking.service");
const booking_service_2 = require("./booking.service");
const payment_module_1 = require("../payment/payment.module");
const mail_module_1 = require("../mail/mail.module");
const transection_module_1 = require("../transection/transection.module");
const transection_model_1 = require("../transection/transection.model");
const deposit_model_1 = require("../deposit/deposit.model");
const uploads_model_1 = require("../uploads/uploads.model");
let FlightModule = class FlightModule {
};
exports.FlightModule = FlightModule;
exports.FlightModule = FlightModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                flight_model_1.Flight,
                flight_model_1.Segment,
                admin_entity_1.Admin,
                user_entity_1.User,
                booking_model_1.BookingSave,
                flight_model_1.BookingIdSave,
                transection_model_1.Transection,
                deposit_model_1.Wallet,
                uploads_model_1.VisaPassport
            ]),
            axios_1.HttpModule,
            airports_module_1.AirportsModule,
            airlines_module_1.AirlinesModule,
            auth_module_1.AuthModule,
            payment_module_1.PaymentModule,
            mail_module_1.MailModule,
            transection_module_1.TransectionModule,
        ],
        controllers: [flight_controller_1.FlightController],
        providers: [
            flyhub_util_1.FlyHubUtil,
            flight_service_1.FlightService,
            sabre_flights_service_1.SabreService,
            booking_service_2.BookingServicesbr,
            sabre_utils_1.SabreUtils,
            bdfare_flights_service_1.BDFareService,
            flyhub_flight_service_1.FlyHubService,
            test_service_1.Test,
            booking_service_1.BookingService,
        ],
        exports: [flyhub_flight_service_1.FlyHubService, flyhub_util_1.FlyHubUtil],
    })
], FlightModule);
//# sourceMappingURL=flight.module.js.map