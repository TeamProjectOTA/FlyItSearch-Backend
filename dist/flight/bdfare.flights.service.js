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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BDFareService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
const bdfare_model_1 = require("./bdfare.model");
let BDFareService = class BDFareService {
    constructor(httpService) {
        this.httpService = httpService;
        this.apiUrl = process.env.API_URL;
        this.apiKey = process.env.API_KEY;
    }
    transformToRequestDto(flightSearchModel) {
        const originDest = flightSearchModel.segments.map(segment => {
            const originDepRequest = new bdfare_model_1.OriginDepRequestDto();
            originDepRequest.iatA_LocationCode = segment.depfrom;
            originDepRequest.date = new Date(segment.depdate).toISOString().split('T')[0];
            const destArrivalRequest = new bdfare_model_1.DestArrivalRequestDto();
            destArrivalRequest.iatA_LocationCode = segment.arrto;
            const originDestDto = new bdfare_model_1.OriginDestDto();
            originDestDto.originDepRequest = originDepRequest;
            originDestDto.destArrivalRequest = destArrivalRequest;
            return originDestDto;
        });
        const pax = [];
        for (let i = 0; i < flightSearchModel.adultcount; i++) {
            const paxDto = new bdfare_model_1.PaxDto();
            paxDto.paxID = `PAX${pax.length + 1}`;
            paxDto.ptc = 'ADT';
            pax.push(paxDto);
        }
        for (let i = 0; i < flightSearchModel.childcount; i++) {
            const paxDto = new bdfare_model_1.PaxDto();
            paxDto.paxID = `PAX${pax.length + 1}`;
            paxDto.ptc = 'CHD';
            pax.push(paxDto);
        }
        for (let i = 0; i < flightSearchModel.infantcount; i++) {
            const paxDto = new bdfare_model_1.PaxDto();
            paxDto.paxID = `PAX${pax.length + 1}`;
            paxDto.ptc = 'INF';
            pax.push(paxDto);
        }
        const travelPreferences = new bdfare_model_1.TravelPreferencesDto();
        travelPreferences.cabinCode = this.mapCabinClass(flightSearchModel.cabinclass);
        const shoppingCriteria = new bdfare_model_1.ShoppingCriteriaDto();
        shoppingCriteria.tripType = flightSearchModel.segments.length === 1 ? 'Oneway' : 'RoundWay';
        shoppingCriteria.travelPreferences = travelPreferences;
        shoppingCriteria.returnUPSellInfo = true;
        const requestInner = new bdfare_model_1.RequestInnerDto();
        requestInner.originDest = originDest;
        requestInner.pax = pax;
        requestInner.shoppingCriteria = shoppingCriteria;
        const requestDto = new bdfare_model_1.RequestDto();
        requestDto.pointOfSale = 'BD';
        requestDto.request = requestInner;
        return requestDto;
    }
    mapCabinClass(cabinClass) {
        switch (cabinClass) {
            case 'Y': return 'Economy';
            case 'W': return 'PremiumEconomy';
            case 'C': return 'Business';
            case 'F': return 'First';
            default: return 'Economy';
        }
    }
    async processApi2(flightSearchModel) {
        const requestDto = this.transformToRequestDto(flightSearchModel);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.apiUrl}/AirShopping`, requestDto, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async airShopping(flightDto) {
        let adultCount = flightDto?.adultcount || 1;
        let childCount = flightDto?.childcount || 0;
        let infantcount = flightDto?.infantcount || 0;
        let cabinclass = flightDto.cabinclass;
        let segments = flightDto.segments;
        const BDFareRequestPax = [];
        if (adultCount > 0) {
            const PaxQuantity = {
                Code: 'ADT',
                Quantity: adultCount,
            };
            BDFareRequestPax.push(PaxQuantity);
        }
        if (childCount > 0) {
            const PaxQuantity = {
                Code: 'CNN',
                Quantity: childCount,
            };
            BDFareRequestPax.push(PaxQuantity);
        }
        if (infantcount > 0) {
            const PaxQuantity = {
                Code: 'INF',
                Quantity: infantcount,
            };
            BDFareRequestPax.push(PaxQuantity);
        }
        const IncludeVendorPref = [
            { Code: 'BG' },
            { Code: 'EK' },
            { Code: 'SQ' },
            { Code: 'BS' },
            { Code: 'TK' },
            { Code: 'QR' },
            { Code: 'GF' },
            { Code: 'SV' },
            { Code: 'KU' },
            { Code: 'CX' },
            { Code: 'UL' },
            { Code: 'AI' },
            { Code: 'TG' },
            { Code: 'UK' },
            { Code: 'MH' },
            { Code: 'WY' },
            { Code: 'FZ' },
        ];
        const SegmentList = [];
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const DepFrom = segment.depfrom;
            const ArrTo = segment.arrto;
            const DepDate = segment.depdate + 'T00:00:00';
            const SingleSegment = {
                RPH: i.toString(),
                DepartureDateTime: DepDate,
                OriginLocation: {
                    LocationCode: DepFrom,
                },
                DestinationLocation: {
                    LocationCode: ArrTo,
                    LocationType: 'C',
                    AllAirports: true,
                },
                TPA_Extensions: {
                    IncludeVendorPref: IncludeVendorPref,
                },
            };
            SegmentList.push(SingleSegment);
        }
    }
    async fareRules() { }
    async offerPrice() { }
    async miniRule() { }
    async flightBooking() { }
    async flightRetrieve() { }
    async flightBookingChange() { }
    async flightBookingCancel() { }
    async processApi(bdfaredto) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.apiUrl}/AirShopping`, bdfaredto, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            }));
            return response.data;
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.BDFareService = BDFareService;
exports.BDFareService = BDFareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], BDFareService);
//# sourceMappingURL=bdfare.flights.service.js.map