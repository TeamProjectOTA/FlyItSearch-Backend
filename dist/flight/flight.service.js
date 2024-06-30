"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const flyhub_model_1 = require("./API Utils/Dto/flyhub.model");
let FlightService = class FlightService {
    async convertToFlyAirSearchDto(flightSearchModel) {
        const segments = flightSearchModel.segments.map(segment => ({
            Origin: segment.depfrom,
            Destination: segment.arrto,
            CabinClass: flightSearchModel.cabinclass,
            DepartureDateTime: segment.depdate,
        }));
        const journeyType = this.determineJourneyType(segments);
        const flyAirSearchDto = (0, class_transformer_1.plainToClass)(flyhub_model_1.FlyAirSearchDto, {
            AdultQuantity: flightSearchModel.adultcount,
            ChildQuantity: flightSearchModel.childcount,
            InfantQuantity: flightSearchModel.infantcount,
            EndUserIp: '11',
            JourneyType: journeyType,
            Segments: segments,
        });
        return flyAirSearchDto;
    }
    determineJourneyType(segments) {
        if (segments.length === 1) {
            return '1';
        }
        if (segments.length === 2) {
            if (segments[0].Destination === segments[1].Origin && segments[0].Origin === segments[1].Destination) {
                return '2';
            }
            return '3';
        }
        return '3';
    }
};
exports.FlightService = FlightService;
exports.FlightService = FlightService = __decorate([
    (0, common_1.Injectable)()
], FlightService);
//# sourceMappingURL=flight.service.js.map