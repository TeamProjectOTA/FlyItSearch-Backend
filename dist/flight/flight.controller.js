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
exports.FlightController = void 0;
const common_1 = require("@nestjs/common");
const flight_model_1 = require("./flight.model");
const swagger_1 = require("@nestjs/swagger");
const fare_rules_flight_dto_1 = require("./dto/fare-rules.flight.dto");
const sabre_flights_service_1 = require("./API Utils/sabre.flights.service");
const bdfare_flights_service_1 = require("./API Utils/bdfare.flights.service");
const bdfare_model_1 = require("./API Utils/Dto/bdfare.model");
const flyhub_model_1 = require("./API Utils/Dto/flyhub.model");
const flyhub_flight_service_1 = require("./API Utils/flyhub.flight.service");
const flyhub_util_1 = require("./API Utils/flyhub.util");
let FlightController = class FlightController {
    constructor(sabreService, bdFareService, flyHubService, testservice) {
        this.sabreService = sabreService;
        this.bdFareService = bdFareService;
        this.flyHubService = flyHubService;
        this.testservice = testservice;
    }
    async getApiResponse(bdfaredto) {
        return await this.bdFareService.processApi(bdfaredto);
    }
    async searchFlights(flightSearchModel) {
        return this.bdFareService.airShopping(flightSearchModel);
    }
    getpnr(pnr) {
        return this.sabreService.checkpnr(pnr);
    }
    airvoid(pnr) {
        return this.sabreService.airvoid(pnr);
    }
    get_ticket(pnr) {
        return this.sabreService.get_ticket(pnr);
    }
    airfarerules(fareRulesDto) {
        return this.sabreService.airfarerules(fareRulesDto);
    }
    airretrieve(pnr) {
        return this.sabreService.airretrieve(pnr);
    }
    async convertToFlyAirSearchDto(flightSearchModel, uuid, request, header) {
        let userIp = request.ip;
        if (userIp.startsWith('::ffff:')) {
            userIp = userIp.split(':').pop();
        }
        return this.flyHubService.convertToFlyAirSearchDto(flightSearchModel, userIp, uuid, header);
    }
    async airPrice(data) {
        return await this.flyHubService.airPrice(data);
    }
    async miniRules(data) {
        return await this.flyHubService.bookingRules(data);
    }
    async airRules(data) {
        return await this.flyHubService.airRules(data);
    }
    async apicheck(SearchResponse, header) {
        const currentTimestamp = new Date();
        return await this.testservice.bookingDataTransformerFlyhb(SearchResponse, currentTimestamp, header);
    }
};
exports.FlightController = FlightController;
__decorate([
    (0, common_1.Post)('/bdfare'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bdfare_model_1.RequestDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "getApiResponse", null);
__decorate([
    (0, common_1.Post)('/bdfareupdate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flight_model_1.FlightSearchModel]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "searchFlights", null);
__decorate([
    (0, common_1.Get)('/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "getpnr", null);
__decorate([
    (0, common_1.Get)('/airvoid/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "airvoid", null);
__decorate([
    (0, common_1.Get)('/ticket/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "get_ticket", null);
__decorate([
    (0, common_1.Post)('sbr/fair-rules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fare_rules_flight_dto_1.FareRulesDto]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "airfarerules", null);
__decorate([
    (0, common_1.Get)('/airretrive/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "airretrieve", null);
__decorate([
    (0, common_1.Post)('fhb/air-search/:uuid'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flight_model_1.FlightSearchModel, String, Object, Object]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "convertToFlyAirSearchDto", null);
__decorate([
    (0, common_1.Post)('flh/price-check'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "airPrice", null);
__decorate([
    (0, common_1.Post)('flh/booking-policy'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "miniRules", null);
__decorate([
    (0, common_1.Post)('flh/air-rules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "airRules", null);
__decorate([
    (0, common_1.Post)('apicheck'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "apicheck", null);
exports.FlightController = FlightController = __decorate([
    (0, swagger_1.ApiTags)('Flight-filters'),
    (0, common_1.Controller)('flights'),
    __metadata("design:paramtypes", [sabre_flights_service_1.SabreService,
        bdfare_flights_service_1.BDFareService,
        flyhub_flight_service_1.FlyHubService,
        flyhub_util_1.FlyHubUtil])
], FlightController);
//# sourceMappingURL=flight.controller.js.map