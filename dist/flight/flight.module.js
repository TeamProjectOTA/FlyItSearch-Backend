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
const booking_service_1 = require("./booking.service");
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
let FlightModule = class FlightModule {
};
exports.FlightModule = FlightModule;
exports.FlightModule = FlightModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([flight_model_1.Flight, flight_model_1.Segment, admin_entity_1.Admin]),
            axios_1.HttpModule,
            airports_module_1.AirportsModule,
            airlines_module_1.AirlinesModule,
        ],
        controllers: [flight_controller_1.FlightController],
        providers: [
            flight_service_1.FlightService,
            sabre_flights_service_1.SabreService,
            booking_service_1.BookingService,
            sabre_utils_1.SabreUtils,
            bdfare_flights_service_1.BDFareService,
            flyhub_flight_service_1.FlyHubService,
            flyhub_util_1.FlyHubUtil,
            test_service_1.Test,
        ],
        exports: [flyhub_flight_service_1.FlyHubService, flyhub_util_1.FlyHubUtil, test_service_1.Test],
    })
], FlightModule);
//# sourceMappingURL=flight.module.js.map