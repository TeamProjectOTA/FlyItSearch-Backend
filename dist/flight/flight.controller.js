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
const user_tokens_guard_1 = require("../auth/user-tokens.guard");
let FlightController = class FlightController {
    constructor(sabreService, bdFareService, flyHubService, testservice) {
        this.sabreService = sabreService;
        this.bdFareService = bdFareService;
        this.flyHubService = flyHubService;
        this.testservice = testservice;
    }
    async searchFlights(flightSearchModel) {
        return this.bdFareService.airShopping(flightSearchModel);
    }
    async BfFareRules(data) {
        return this.bdFareService.fareRules(data);
    }
    async BdfarePriceCheck(data) {
        return this.bdFareService.offerPrice(data);
    }
    async BdfareMiniRules(data) {
        return this.bdFareService.miniRule(data);
    }
    search(flightdto) {
        const sabre = this.sabreService.shoppingBranded(flightdto);
        return sabre;
    }
    getpnr(pnr) {
        return this.sabreService.checkpnr(pnr);
    }
    async airvoid(pnr) {
        return await this.sabreService.airvoid(pnr);
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
    async convertToFlyAirSearchDto(flightSearchModel, request) {
        let userIp = request.ip;
        if (userIp.startsWith('::ffff:')) {
            userIp = userIp.split(':').pop();
        }
        return await this.flyHubService.convertToFlyAirSearchDto(flightSearchModel, userIp);
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
};
exports.FlightController = FlightController;
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('/bdFare'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flight_model_1.FlightSearchModel]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "searchFlights", null);
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('/bdFare/fareRules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bdfare_model_1.searchResultDtobdf]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "BfFareRules", null);
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('/bdFare/priceCheck'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bdfare_model_1.searchResultDtobdf]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "BdfarePriceCheck", null);
__decorate([
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('/bdFareMiniRule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bdfare_model_1.searchResultDtobdf]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "BdfareMiniRules", null);
__decorate([
    (0, common_1.Post)('/sabre'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flight_model_1.FlightSearchModel]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "getpnr", null);
__decorate([
    (0, common_1.Get)('/airVoid/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "airvoid", null);
__decorate([
    (0, common_1.Get)('/ticket/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "get_ticket", null);
__decorate([
    (0, common_1.Post)('sbr/fairRules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fare_rules_flight_dto_1.FareRulesDto]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "airfarerules", null);
__decorate([
    (0, common_1.Get)('/airRetrive/:pnr'),
    __param(0, (0, common_1.Param)('pnr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlightController.prototype, "airretrieve", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.Post)('fhb/airSearch/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flight_model_1.FlightSearchModel, Object]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "convertToFlyAirSearchDto", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, common_1.UseGuards)(user_tokens_guard_1.UserTokenGuard),
    (0, common_1.Post)('flh/priceCheck'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "airPrice", null);
__decorate([
    (0, common_1.Post)('flh/farePolicyMiniRules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "miniRules", null);
__decorate([
    (0, common_1.Post)('flh/fairRules'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flyhub_model_1.searchResultDto]),
    __metadata("design:returntype", Promise)
], FlightController.prototype, "airRules", null);
exports.FlightController = FlightController = __decorate([
    (0, swagger_1.ApiTags)('Flight-filters'),
    (0, common_1.Controller)('flights'),
    __metadata("design:paramtypes", [sabre_flights_service_1.SabreService,
        bdfare_flights_service_1.BDFareService,
        flyhub_flight_service_1.FlyHubService,
        flyhub_util_1.FlyHubUtil])
], FlightController);
//# sourceMappingURL=flight.controller.js.map