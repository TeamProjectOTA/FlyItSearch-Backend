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
const axios_1 = require("axios");
const bdfare_model_1 = require("./Dto/bdfare.model");
const bdfare_util_1 = require("./bdfare.util");
const mail_service_1 = require("../../mail/mail.service");
let BDFareService = class BDFareService {
    constructor(bdfareUtil, mailService) {
        this.bdfareUtil = bdfareUtil;
        this.mailService = mailService;
        this.apiUrl = process.env.BDFareAPI_URL;
        this.apiKey = process.env.BDFareAPI_KEY;
    }
    transformToRequestDto(flightSearchModel) {
        const originDest = flightSearchModel.segments.map((segment) => {
            const originDepRequest = new bdfare_model_1.OriginDepRequestDto();
            originDepRequest.iatA_LocationCode = segment.depfrom;
            originDepRequest.date = segment.depdate;
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
        shoppingCriteria.tripType = this.determineJourneyType(flightSearchModel.segments);
        shoppingCriteria.travelPreferences = travelPreferences;
        shoppingCriteria.returnUPSellInfo = false;
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
            case '1':
                return 'Economy';
            case '2':
                return 'PremiumEconomy';
            case '3':
                return 'Business';
            case '4':
                return 'First';
            default:
                return 'Economy';
        }
    }
    async airShopping(flightSearchModel) {
        const requestDto = this.transformToRequestDto(flightSearchModel);
        const tripType = requestDto.request.shoppingCriteria.tripType;
        const response = await axios_1.default.post(`${this.apiUrl}/AirShopping`, requestDto, {
            headers: {
                'X-API-KEY': this.apiKey,
            },
        });
        if (response.data.response != null) {
            return await this.bdfareUtil.afterSerarchDataModifierBdFare(response.data.response, tripType);
        }
        return [];
    }
    async fareRules(data) {
        const transformedData = {
            traceId: data.SearchId,
            offerId: data.ResultId[0],
        };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/FareRules`, transformedData, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            });
            return response.data.response;
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async offerPrice(data) {
        const transformedData = {
            traceId: data.SearchId,
            offerId: data.ResultId,
        };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/OfferPrice`, transformedData, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            });
            return await this.bdfareUtil.afterSerarchDataModifierBdFare(response.data.response);
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async miniRule(data) {
        const transformedData = {
            traceId: data.SearchId,
            offerId: data.ResultId[0],
        };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/MiniRule`, transformedData, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            });
            return response.data.response;
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async flightBooking(bookingdata, header, currentTimestamp, personIds) {
        const data = this.bookingDataModification(bookingdata);
        const OrderSellRequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/OrderSell`,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
            },
            data: data,
        };
        const OrderCreateRequest = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${this.apiUrl}/OrderCreate`,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': this.apiKey,
            },
            data: data,
        };
        const response = await (0, axios_1.default)(OrderSellRequest);
        const response1 = await (0, axios_1.default)(OrderCreateRequest);
        return await this.bdfareUtil.bookingDataTransformer(response1.data.response, header, currentTimestamp, personIds);
    }
    async flightRetrieve(BookingID) {
        const orderReference = { orderReference: BookingID.BookingID };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/OrderRetrieve`, orderReference, {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            return await this.bdfareUtil.airRetrive(response.data.response);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return error.response?.data || error.message;
            }
        }
    }
    async flightBookingCancel(BookingID) {
        const orderReference = { orderReference: BookingID.BookingID };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/OrderCancel`, orderReference, {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.response.orderStatus == 'Cancelled') {
                const airRetrive = await this.flightRetrieve(BookingID);
                const status = response.data.response.orderStatus;
                const bookingId = response.data.response.orderReference;
                const email = airRetrive[0]?.PassengerList[0]?.Email;
                await this.mailService.cancelMail(bookingId, status, email);
                return airRetrive;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async flightBookingChange() { }
    bookingDataModification(data) {
        const { Passengers } = data;
        const dataModified = {
            traceId: data.SearchId,
            offerId: [data.ResultId[0]],
            request: {
                contactInfo: {
                    phone: {
                        phoneNumber: Passengers[0]?.ContactNumber.slice(3),
                        countryDialingCode: Passengers[0]?.ContactNumber.slice(0, 3),
                    },
                    emailAddress: Passengers[0]?.Email,
                },
                paxList: Passengers.map((passenger) => ({
                    ptc: passenger?.PaxType,
                    individual: {
                        givenName: passenger?.FirstName,
                        surname: passenger?.LastName,
                        gender: passenger?.Gender,
                        birthdate: passenger?.DateOfBirth,
                        nationality: passenger?.PassportNationality,
                        identityDoc: {
                            identityDocType: 'Passport',
                            identityDocID: passenger?.PassportNumber,
                            expiryDate: passenger?.PassportExpiryDate,
                        },
                        ...(passenger.PaxType === 'Infant' && {
                            associatePax: {
                                givenName: Passengers.find((p) => p.IsLeadPassenger)?.FirstName || '',
                                surname: Passengers.find((p) => p.IsLeadPassenger)?.LastName || '',
                            },
                        }),
                    },
                    sellSSR: passenger?.FFAirline || passenger?.SSRType || passenger?.SSRRemarks
                        ? [
                            {
                                ssrRemark: passenger?.SSRRemarks,
                                ssrCode: passenger?.SSRType,
                                loyaltyProgramAccount: {
                                    airlineDesigCode: passenger?.FFAirline,
                                    accountNumber: passenger?.FFNumber,
                                },
                            },
                        ]
                        : [],
                })),
            },
        };
        return dataModified;
    }
    determineJourneyType(segments) {
        if (segments.length === 1) {
            return '1';
        }
        if (segments.length === 2) {
            if (segments[0].Destination === segments[1].Origin &&
                segments[0].Origin === segments[1].Destination) {
                return '2';
            }
            return '3';
        }
        return '3';
    }
};
exports.BDFareService = BDFareService;
exports.BDFareService = BDFareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bdfare_util_1.BfFareUtil,
        mail_service_1.MailService])
], BDFareService);
//# sourceMappingURL=bdfare.flights.service.js.map