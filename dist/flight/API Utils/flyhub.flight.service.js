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
exports.FlyHubService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const flyhub_util_1 = require("./flyhub.util");
const class_transformer_1 = require("class-transformer");
const flyhub_model_1 = require("./Dto/flyhub.model");
const core_1 = require("@nestjs/core");
let FlyHubService = class FlyHubService {
    constructor(flyHubUtil, request) {
        this.flyHubUtil = flyHubUtil;
        this.request = request;
        this.username = process.env.FLYHUB_UserName;
        this.apiKey = process.env.FLYHUB_ApiKey;
        this.apiUrl = process.env.FLyHub_Url;
    }
    async getToken() {
        try {
            const config = {
                method: 'post',
                url: `${this.apiUrl}/Authenticate`,
                data: {
                    username: this.username,
                    apiKey: this.apiKey,
                },
            };
            const response = await axios_1.default.request(config);
            const token = response?.data?.TokenId;
            console.log(response?.data);
            if (!token) {
                throw new common_1.HttpException('Token not found in response', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return token;
        }
        catch (error) {
            console.error('Error fetching token:', error.response?.data || error.message);
            throw new common_1.HttpException('Failed to authenticate', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async convertToFlyAirSearchDto(flightSearchModel) {
        const cabinClassMapping = {
            'Y': 'Economy',
            'S': 'Premium_Economy',
            'C': 'Business',
            'P': 'First',
        };
        const segments = flightSearchModel.segments.map(segment => ({
            Origin: segment.depfrom,
            Destination: segment.arrto,
            CabinClass: cabinClassMapping[flightSearchModel.cabinclass],
            DepartureDateTime: segment.depdate.toISOString(),
        }));
        const tripType = flightSearchModel.segments.length === 1 ? '1' :
            flightSearchModel.segments.length === 2 ? '2' :
                '3';
        const flyAirSearchDto = (0, class_transformer_1.plainToClass)(flyhub_model_1.FlyAirSearchDto, {
            AdultQuantity: flightSearchModel.adultcount,
            ChildQuantity: flightSearchModel.childcount,
            InfantQuantity: flightSearchModel.infantcount,
            EndUserIp: "11",
            JourneyType: tripType,
            Segments: segments,
        });
        return await this.searchFlights(flyAirSearchDto);
    }
    async searchFlights(data) {
        try {
            const token = await this.getToken();
            const response = await axios_1.default.post(`${this.apiUrl}/AirSearch`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return this.flyHubUtil.restBFMParser(response.data);
        }
        catch (error) {
            console.error('Error searching flights:', error.response?.data || error.message);
            throw new common_1.HttpException('Flight search failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.FlyHubService = FlyHubService;
exports.FlyHubService = FlyHubService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [flyhub_util_1.FlyHubUtil, Request])
], FlyHubService);
//# sourceMappingURL=flyhub.flight.service.js.map