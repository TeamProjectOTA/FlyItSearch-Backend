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
exports.BDFareService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const flight_model_1 = require("../flight.model");
const bdfare_model_1 = require("./Dto/bdfare.model");
const bdfare_util_1 = require("./bdfare.util");
const booking_model_1 = require("../../book/booking.model");
const mail_service_1 = require("../../mail/mail.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BDFareService = class BDFareService {
    constructor(bookingIdSave, bookingSaveRepository, bdfareUtil, mailService) {
        this.bookingIdSave = bookingIdSave;
        this.bookingSaveRepository = bookingSaveRepository;
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
        shoppingCriteria.preferCombine = true;
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
        const url = `${this.apiUrl}/AirShopping`;
        const requestHeader = {
            headers: {
                'X-API-KEY': this.apiKey,
            },
        };
        try {
            const response = await axios_1.default.post(url, requestDto, requestHeader);
            if (response.data.response != null) {
                return await this.bdfareUtil.afterSerarchDataModifierBdFare(response.data.response, tripType);
            }
            return [];
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }
    async fareRules(data) {
        const transformedData = {
            traceId: data.SearchId,
            offerId: data.ResultId,
        };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/FareRules`, transformedData, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            });
            if (!response.data.response) {
                return {};
            }
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
            offerId: [data.ResultId],
        };
        const url = `${this.apiUrl}/OfferPrice`;
        const requestHeader = {
            headers: {
                'X-API-KEY': this.apiKey,
            },
        };
        try {
            const response = await axios_1.default.post(url, transformedData, requestHeader);
            if (!response.data.response) {
                throw new common_1.NotFoundException('Resource not found');
            }
            return await this.bdfareUtil.afterSerarchDataModifierBdFare(response.data.response);
        }
        catch (error) {
            throw new common_1.NotFoundException();
        }
    }
    async miniRule(data) {
        const transformedData = {
            traceId: data.SearchId,
            offerId: data.ResultId,
        };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/MiniRule`, transformedData, {
                headers: {
                    'X-API-KEY': this.apiKey,
                },
            });
            if (!response.data.response) {
                return {};
            }
            return response.data.response;
        }
        catch (error) {
            console.error('Error calling external API', error);
            throw new common_1.HttpException('Error calling external API', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async flightBooking(bookingdata, header, currentTimestamp, personIds, userIp) {
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
        try {
            const response = await (0, axios_1.default)(OrderSellRequest);
            const response1 = await (0, axios_1.default)(OrderCreateRequest);
            return await this.bdfareUtil.bookingDataTransformer(response1.data.response, header, currentTimestamp, personIds, userIp);
        }
        catch (e) {
            console.log(e);
            return new common_1.RequestTimeoutException();
        }
    }
    async flightRetrieve(BookingID, header, userIp) {
        const findBooking = await this.bookingSaveRepository.findOne({
            where: { bookingId: BookingID.BookingID },
            relations: ['user'],
        });
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
        });
        if (!bookingId) {
            throw new common_1.NotFoundException('No booking found on this id');
        }
        const orderReference = { orderReference: bookingId.flyhubId };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/OrderRetrieve`, orderReference, {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            return await this.bdfareUtil.airRetrive(response.data.response, BookingID.BookingID, findBooking.bookingStatus, findBooking.TripType, findBooking.bookingDate, header, userIp);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return error.response?.data || error.message;
            }
        }
    }
    async flightBookingCancel(BookingID, header) {
        const bookingId = await this.bookingIdSave.findOne({
            where: { flyitSearchId: BookingID.BookingID },
        });
        if (!bookingId) {
            throw new common_1.NotFoundException('No booking found on this id');
        }
        const orderReference = { orderReference: bookingId.flyhubId };
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/OrderCancel`, orderReference, {
                headers: {
                    'X-API-KEY': this.apiKey,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            if (response.data.response.orderStatus == 'Cancelled') {
                const findBooking = await this.bookingSaveRepository.findOne({
                    where: { bookingId: BookingID.BookingID },
                    relations: ['user'],
                });
                findBooking.bookingStatus = response.data.response.orderStatus;
                await this.bookingSaveRepository.save(findBooking);
                const airRetrive = await this.flightRetrieve(BookingID, header);
                const status = response.data.response.orderStatus;
                const bookingId = response.data.response.orderReference;
                const email = airRetrive[0]?.PassengerList[0]?.Email;
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
        const adults = Passengers.filter((p) => p.PaxType === 'Adult');
        const infants = Passengers.filter((p) => p.PaxType === 'Infant');
        const dataModified = {
            traceId: data.SearchId,
            offerId: [data.ResultId],
            request: {
                contactInfo: {
                    phone: {
                        phoneNumber: Passengers[0]?.ContactNumber.slice(2),
                        countryDialingCode: Passengers[0]?.ContactNumber.slice(0, 2),
                    },
                    emailAddress: Passengers[0]?.Email,
                },
                paxList: Passengers.map((passenger, index) => {
                    const isInfant = passenger?.PaxType === 'Infant';
                    const associatedAdult = isInfant && adults[index % adults.length];
                    return {
                        ptc: passenger?.PaxType,
                        individual: {
                            givenName: passenger?.FirstName,
                            surname: passenger?.LastName,
                            gender: passenger?.Gender,
                            birthdate: passenger?.DateOfBirth,
                            nationality: passenger?.CountryCode,
                            ...(passenger?.PassportNumber || passenger?.PassportExpiryDate
                                ? {
                                    identityDoc: {
                                        identityDocType: 'Passport',
                                        identityDocID: passenger?.PassportNumber,
                                        expiryDate: passenger?.PassportExpiryDate,
                                    },
                                }
                                : {}),
                            ...(isInfant &&
                                associatedAdult && {
                                associatePax: {
                                    givenName: associatedAdult.FirstName,
                                    surname: associatedAdult.LastName,
                                },
                            }),
                        },
                        sellSSR: passenger?.FFAirline ||
                            passenger?.SSRType ||
                            passenger?.SSRRemarks
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
                    };
                }),
            },
        };
        return dataModified;
    }
    determineJourneyType(segments) {
        if (!segments || segments.length === 0) {
            throw new Error('Segments array is empty or undefined.');
        }
        if (segments.length === 1) {
            return '1';
        }
        if (segments.length === 2) {
            const [firstSegment, secondSegment] = segments;
            if (firstSegment.arrto === secondSegment.depfrom &&
                firstSegment.depfrom === secondSegment.arrto) {
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
    __param(0, (0, typeorm_1.InjectRepository)(flight_model_1.BookingIdSave)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_model_1.BookingSave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        bdfare_util_1.BfFareUtil,
        mail_service_1.MailService])
], BDFareService);
//# sourceMappingURL=bdfare.flights.service.js.map