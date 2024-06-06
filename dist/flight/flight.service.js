"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const flight_model_1 = require("./flight.model");
let FlightService = class FlightService {
    constructor(flightRepository) {
        this.flightRepository = flightRepository;
    }
    async filterFlights(filter) {
        let query = this.flightRepository.createQueryBuilder('flight');
        if (filter.journyType) {
            query = query.andWhere('flight.JourneyType = :journeyType', {
                journeyType: filter.journyType,
            });
        }
        if (filter.adultCount) {
            query = query.andWhere('flight.AdultQuantity >= :adultCount', {
                adultCount: filter.adultCount,
            });
        }
        if (filter.childerenCount) {
            query = query.andWhere('flight.ChildQuantity >= :childerenCount', {
                childCount: filter.childerenCount,
            });
        }
        if (filter.infantCount) {
            query = query.andWhere('flight.InfantQuantity >= :infantCount', {
                infantCount: filter.infantCount,
            });
        }
        if (filter.Segments && filter.Segments.length > 0) {
            filter.Segments.forEach((segment, index) => {
                const segmentAlias = `segment_${index}`;
                query = query.innerJoinAndSelect('flight.Segments', segmentAlias);
                query = query.andWhere(`${segmentAlias}.Origin = :origin${index}`, {
                    [`origin${index}`]: segment.Origin,
                });
                query = query.andWhere(`${segmentAlias}.Destination = :destination${index}`, { [`destination${index}`]: segment.Destination });
                query = query.andWhere(`${segmentAlias}.CabinClass = :cabinClass${index}`, { [`cabinClass${index}`]: segment.CabinClass });
                query = query.andWhere(`${segmentAlias}.DepartureDateTime = :departureDateTime${index}`, { [`departureDateTime${index}`]: segment.DepartureDateTime });
            });
        }
        if (filter.cities && filter.cities.length > 0) {
            filter.cities.forEach((city, index) => {
                query = query.andWhere(`JSON_CONTAINS(flight.cities, :city${index})`, {
                    [`city${index}`]: JSON.stringify(city),
                });
            });
        }
        return await query.getMany();
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(flight_model_1.Flight)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FlightService);
//# sourceMappingURL=flight.service.js.map