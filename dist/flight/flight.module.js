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
const sabre_flights_service_1 = require("./sabre.flights.service");
const booking_service_1 = require("./booking.service");
let FlightModule = class FlightModule {
};
exports.FlightModule = FlightModule;
exports.FlightModule = FlightModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([flight_model_1.Flight, flight_model_1.Segment])],
        controllers: [flight_controller_1.FlightController],
        providers: [flight_service_1.FlightService, sabre_flights_service_1.SabreService, booking_service_1.BookingService],
    })
], FlightModule);
//# sourceMappingURL=flight.module.js.map