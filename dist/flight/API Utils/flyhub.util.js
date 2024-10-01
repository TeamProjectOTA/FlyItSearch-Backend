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
exports.FlyHubUtil = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_service_1 = require("../../book/booking.service");
const mail_service_1 = require("../../mail/mail.service");
const payment_service_1 = require("../../payment/payment.service");
const flight_model_1 = require("../flight.model");
const typeorm_2 = require("typeorm");
const transection_service_1 = require("../../transection/transection.service");
const deposit_model_1 = require("../../deposit/deposit.model");
const auth_service_1 = require("../../auth/auth.service");
let FlyHubUtil = class FlyHubUtil {
    constructor(BookService, mailService, paymentService, authService, transectionService, bookingIdSave, walletRepository) {
        this.BookService = BookService;
        this.mailService = mailService;
        this.paymentService = paymentService;
        this.authService = authService;
        this.transectionService = transectionService;
        this.bookingIdSave = bookingIdSave;
        this.walletRepository = walletRepository;
    }
    async restBFMParser(SearchResponse, journeyType) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (Results) {
            const DepCountry = Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
            const ArrCountry = Results?.[0]?.segments[0]?.Destination?.Airport?.CountryName;
            let partialoption;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
                partialoption = true;
            }
            else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
                partialoption = true;
            }
            for (const Result of Results) {
                const ValidatingCarrier = Result?.Validatingcarrier;
                const FareType = Result?.FareType || 'Regular';
                const AllPassenger = Result?.Fares || [];
                const CarrierName = Result?.segments[0]?.Airline?.AirlineName || 'N/F';
                const Instant_Payment = Result?.FareType === 'InstantTicketing';
                const IsBookable = Result?.HoldAllowed;
                let discount = Result?.Discount * 0.2;
                let addAmount = 0;
                if (discount < 100) {
                    addAmount = Result?.TotalFareWithAgentMarkup * 0.015;
                }
                const equivalentAmount = AllPassenger.reduce((sum, passenger) => sum + (passenger?.BaseFare * passenger?.PassengerCount || 0), 0);
                const equivalentAmount1 = equivalentAmount + addAmount;
                const Taxes = AllPassenger.reduce((sum, passenger) => sum + (passenger?.Tax * passenger?.PassengerCount || 0), 0);
                const extraService = AllPassenger.reduce((sum, passenger) => sum + (passenger?.OtherCharges * passenger?.PassengerCount || 0), 0);
                const servicefee = AllPassenger.reduce((sum, passenger) => sum + (passenger?.ServiceFee * passenger?.PassengerCount || 0), 0);
                let TotalFare = Result?.TotalFareWithAgentMarkup + addAmount + discount || 0;
                if (Result?.segments) {
                    const AllSegments = Result?.segments;
                    let Cabinclass = AllSegments?.Airline?.CabinClass;
                    let TripType;
                    if (journeyType === '1') {
                        TripType = 'Oneway';
                    }
                    else if (journeyType === '2') {
                        TripType = 'Return';
                    }
                    else if (journeyType === '3') {
                        TripType = 'Multicity';
                    }
                    const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = Result?.IsRefundable;
                    let TimeLimit = null;
                    if (Result?.LastTicketDate) {
                        const lastTicketDate = Result?.LastTicketDate;
                        TimeLimit = `${lastTicketDate}`;
                    }
                    let isAddAmountAdded = false;
                    const PriceBreakDown = AllPassenger.map((allPassenger) => {
                        const PaxType = allPassenger?.PaxType;
                        const paxCount = allPassenger?.PassengerCount;
                        let basefare;
                        if (!isAddAmountAdded) {
                            basefare = allPassenger?.BaseFare + addAmount / paxCount;
                            isAddAmountAdded = true;
                        }
                        else {
                            basefare = allPassenger?.BaseFare;
                        }
                        const othercharge = allPassenger?.OtherCharges;
                        const servicefee = allPassenger?.ServiceFee;
                        const totalTaxAmount = allPassenger?.Tax;
                        const PaxtotalFare = basefare + totalTaxAmount + servicefee + othercharge;
                        const PaxequivalentAmount = basefare;
                        const baggageDetails = AllSegments.map((segment) => {
                            let allowance = '';
                            const allPaxBaggage = segment?.baggageDetails?.find((baggage) => baggage?.IsAllPax === true);
                            if (allPaxBaggage) {
                                allowance = allPaxBaggage?.Checkin || '';
                            }
                            else {
                                allowance =
                                    segment?.baggageDetails
                                        ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType)
                                        .map((baggage) => baggage?.Checkin)[0] || '';
                            }
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: allowance || '',
                            };
                        });
                        let i = 0;
                        const FareBasis = Result?.segments.map((fareComponent) => {
                            i++;
                            return {
                                Origin: fareComponent?.Origin?.Airport?.AirportCode,
                                Destination: fareComponent?.Destination?.Airport?.AirportCode,
                                DepDate: fareComponent?.Origin?.DepTime,
                                FareBasisCode: fareComponent?.Airline?.BookingClass,
                                Carrier: fareComponent?.Airline?.AirlineCode,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: Math.ceil(PaxequivalentAmount),
                            Taxes: totalTaxAmount,
                            ServiceFee: servicefee,
                            OtherCharges: othercharge,
                            TotalFare: Math.ceil(PaxtotalFare),
                            PaxCount: paxCount,
                            Bag: baggageDetails,
                            FareComponent: FareBasis,
                        };
                    });
                    const processSegments = (segmentsList) => {
                        if (segmentsList.length === 0)
                            return null;
                        const firstSegment = segmentsList[0];
                        const lastSegment = segmentsList[segmentsList.length - 1];
                        let arivalTime = new Date(firstSegment.Destination.ArrTime).getTime();
                        let deptureTime = new Date(lastSegment.Origin.DepTime).getTime();
                        const totalduration = deptureTime - arivalTime;
                        let totalDurationInMinutes = Math.floor(totalduration / (1000 * 60));
                        if (totalDurationInMinutes < 0) {
                            totalDurationInMinutes = 0;
                        }
                        const legInfo = {
                            DepDate: firstSegment?.Origin?.DepTime,
                            DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
                            ArrTo: lastSegment.Destination?.Airport?.AirportCode,
                            test: totalDurationInMinutes,
                            Duration: segmentsList?.reduce((acc, segment) => acc + parseInt(segment?.JourneyDuration), 0),
                        };
                        const bookingClass = firstSegment?.Airline?.BookingClass;
                        const cabinClass = firstSegment?.Airline?.CabinClass;
                        const seatsAvailable = Result?.Availabilty;
                        const segments = segmentsList?.map((segment) => ({
                            MarketingCarrier: segment?.Airline?.AirlineCode,
                            MarketingCarrierName: segment?.Airline?.AirlineName,
                            MarketingFlightNumber: segment?.Airline?.FlightNumber,
                            OperatingCarrier: segment?.Airline?.OperatingCarrier,
                            OperatingFlightNumber: segment?.Airline?.FlightNumber,
                            OperatingCarrierName: segment?.Airline?.AirlineName,
                            DepFrom: segment?.Origin?.Airport?.AirportCode,
                            DepAirPort: segment?.Origin?.Airport?.AirportName,
                            DepLocation: `${segment?.Origin?.Airport?.CityName}, ${segment?.Origin?.Airport?.CountryName}`,
                            DepDateAdjustment: 0,
                            DepTime: segment?.Origin?.DepTime,
                            ArrTo: segment?.Destination?.Airport?.AirportCode,
                            ArrAirPort: segment?.Destination?.Airport?.AirportName,
                            ArrLocation: `${segment?.Destination?.Airport?.CityName}, ${segment?.Destination?.Airport?.CountryName}`,
                            ArrDateAdjustment: 0,
                            ArrTime: segment?.Destination?.ArrTime,
                            OperatedBy: segment?.Airline?.AirlineName,
                            StopCount: segment?.StopQuantity,
                            Duration: parseInt(segment?.JourneyDuration),
                            AircraftTypeName: segment?.Equipment,
                            Amenities: {},
                            DepartureGate: segment?.Origin?.Airport?.Terminal || 'TBA',
                            ArrivalGate: segment?.Destination?.Airport?.Terminal || 'TBA',
                            HiddenStops: [],
                            SegmentCode: {
                                bookingCode: bookingClass,
                                cabinCode: cabinClass,
                                seatsAvailable: seatsAvailable,
                            },
                        }));
                        legInfo['Segments'] = segments;
                        return legInfo;
                    };
                    const groupedSegments = AllSegments?.reduce((acc, segment) => {
                        (acc[segment?.SegmentGroup] =
                            acc[segment?.SegmentGroup] || []).push(segment);
                        return acc;
                    }, {});
                    const AllLegsInfo = [];
                    for (const key in groupedSegments) {
                        const groupSegments = groupedSegments[key];
                        const legInfo = processSegments(groupSegments);
                        if (legInfo) {
                            AllLegsInfo.push(legInfo);
                        }
                    }
                    FlightItenary.push({
                        System: 'FLYHUB',
                        ResultId: Result?.ResultID,
                        SearchId: SearchResponse?.SearchId,
                        PassportMadatory: Result?.PassportMadatory,
                        InstantPayment: Instant_Payment,
                        IsBookable: IsBookable,
                        TripType: TripType,
                        FareType: FareType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        Cabinclass: Cabinclass,
                        BaseFare: Math.ceil(equivalentAmount1),
                        Taxes: Taxes,
                        SerViceFee: extraService + servicefee || 0,
                        NetFare: Math.ceil(TotalFare),
                        GrossFare: Math.ceil(NetFare),
                        PartialOption: partialoption,
                        PartialFare: Math.ceil(PartialAmount),
                        TimeLimit: TimeLimit,
                        RePriceStatus: SearchResponse?.RePriceStatus,
                        Refundable: Refundable,
                        ExtraService: Result?.ExtraServices || null,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo,
                    });
                }
            }
        }
        return FlightItenary;
    }
    async airRetriveDataTransformer(SearchResponse, fisId, bookingStatus, tripType, bookingDate, header) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (Results) {
            const DepCountry = Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
            const ArrCountry = Results?.[0]?.segments[0]?.Destination?.Airport?.CountryName;
            let partialoption;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
                partialoption = true;
            }
            else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
                partialoption = true;
            }
            for (const Result of Results) {
                const ValidatingCarrier = Result?.Validatingcarrier;
                const FareType = Result?.FareType || 'Regular';
                const AllPassenger = Result?.Fares || [];
                const CarrierName = Result?.segments[0]?.Airline?.AirlineName || 'N/F';
                const Instant_Payment = Result?.FareType === 'InstantTicketing';
                const IsBookable = Result?.HoldAllowed;
                let discount = Result?.Discount * 0.2;
                let addAmount = 0;
                if (discount < 100) {
                    addAmount = Result?.TotalFareWithAgentMarkup * 0.015;
                }
                const equivalentAmount = AllPassenger.reduce((sum, passenger) => sum + (passenger?.BaseFare * passenger?.PassengerCount || 0), 0);
                let equivalentAmount1 = equivalentAmount + addAmount;
                const Taxes = AllPassenger.reduce((sum, passenger) => sum + (passenger?.Tax * passenger?.PassengerCount || 0), 0);
                const extraService = AllPassenger.reduce((sum, passenger) => sum + (passenger?.OtherCharges * passenger?.PassengerCount || 0), 0);
                const servicefee = AllPassenger.reduce((sum, passenger) => sum + (passenger?.ServiceFee * passenger?.PassengerCount || 0), 0);
                let TotalFare = Result?.TotalFareWithAgentMarkup + addAmount + discount || 0;
                if (Result?.segments) {
                    const AllSegments = Result?.segments;
                    let Cabinclass = AllSegments?.Airline?.CabinClass;
                    const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = Result?.IsRefundable;
                    let TimeLimit = null;
                    if (Result?.LastTicketDate) {
                        const lastTicketDate = Result?.LastTicketDate;
                        TimeLimit = `${lastTicketDate}`;
                    }
                    const PriceBreakDown = AllPassenger.map((allPassenger) => {
                        const PaxType = allPassenger?.PaxType;
                        const paxCount = allPassenger?.PassengerCount;
                        const basefare = allPassenger?.BaseFare + addAmount;
                        const othercharge = allPassenger?.OtherCharges;
                        const servicefee = allPassenger?.ServiceFee;
                        const totalTaxAmount = allPassenger?.Tax;
                        const PaxtotalFare = basefare + totalTaxAmount + servicefee + othercharge;
                        const PaxequivalentAmount = basefare;
                        const baggageDetails = AllSegments.map((segment) => {
                            let allowance = '';
                            const allPaxBaggage = segment?.baggageDetails?.find((baggage) => baggage?.IsAllPax === true);
                            if (allPaxBaggage) {
                                allowance = allPaxBaggage?.Checkin || '';
                            }
                            else {
                                allowance =
                                    segment?.baggageDetails
                                        ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType)
                                        .map((baggage) => baggage?.Checkin)[0] || '';
                            }
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: allowance || '',
                            };
                        });
                        let i = 0;
                        const FareBasis = Result?.segments.map((fareComponent) => {
                            i++;
                            return {
                                Origin: fareComponent?.Origin?.Airport?.AirportCode,
                                Destination: fareComponent?.Destination?.Airport?.AirportCode,
                                DepDate: fareComponent?.Origin?.DepTime,
                                FareBasisCode: fareComponent?.Airline?.BookingClass,
                                Carrier: fareComponent?.Airline?.AirlineCode,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: Math.ceil(PaxequivalentAmount),
                            Taxes: totalTaxAmount,
                            ServiceFee: servicefee,
                            OtherCharges: othercharge,
                            TotalFare: Math.ceil(PaxtotalFare),
                            PaxCount: paxCount,
                            Bag: baggageDetails,
                            FareComponent: FareBasis,
                        };
                    });
                    const processSegments = (segmentsList) => {
                        if (segmentsList.length === 0)
                            return null;
                        const firstSegment = segmentsList[0];
                        const lastSegment = segmentsList[segmentsList.length - 1];
                        const legInfo = {
                            DepDate: firstSegment?.Origin?.DepTime,
                            DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
                            ArrTo: lastSegment.Destination?.Airport?.AirportCode,
                            TotalFlightDuration: segmentsList?.reduce((acc, segment) => acc + parseInt(segment?.JourneyDuration), 0),
                        };
                        const bookingClass = firstSegment?.Airline?.BookingClass;
                        const cabinClass = firstSegment?.Airline?.CabinClass;
                        const seatsAvailable = Result?.Availabilty;
                        const segments = segmentsList?.map((segment) => ({
                            MarketingCarrier: segment?.Airline?.AirlineCode,
                            MarketingCarrierName: segment?.Airline?.AirlineName,
                            MarketingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrier: segment?.Airline?.OperatingCarrier,
                            OperatingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrierName: segment?.Airline?.AirlineName,
                            DepFrom: segment?.Origin?.Airport?.AirportCode,
                            DepAirPort: segment?.Origin?.Airport?.AirportName,
                            DepLocation: `${segment?.Origin?.Airport?.CityName}, ${segment?.Origin?.Airport?.CountryName}`,
                            DepDateAdjustment: 0,
                            DepTime: segment?.Origin?.DepTime,
                            ArrTo: segment?.Destination?.Airport?.AirportCode,
                            ArrAirPort: segment?.Destination?.Airport?.AirportName,
                            ArrLocation: `${segment?.Destination?.Airport?.CityName}, ${segment?.Destination?.Airport?.CountryName}`,
                            ArrDateAdjustment: 0,
                            ArrTime: segment?.Destination?.ArrTime,
                            OperatedBy: segment?.Airline?.AirlineName,
                            StopCount: segment?.StopQuantity,
                            Duration: parseInt(segment?.JourneyDuration),
                            AircraftTypeName: segment?.Equipment,
                            Amenities: {},
                            DepartureGate: segment?.Origin?.Airport?.Terminal || 'TBA',
                            ArrivalGate: segment?.Destination?.Airport?.Terminal || 'TBA',
                            HiddenStops: [],
                            TotalMilesFlown: 0,
                            SegmentCode: {
                                bookingCode: bookingClass,
                                cabinCode: cabinClass,
                                seatsAvailable: seatsAvailable,
                            },
                        }));
                        legInfo['Segments'] = segments;
                        return legInfo;
                    };
                    const groupedSegments = AllSegments?.reduce((acc, segment) => {
                        (acc[segment?.SegmentGroup] =
                            acc[segment?.SegmentGroup] || []).push(segment);
                        return acc;
                    }, {});
                    const AllLegsInfo = [];
                    for (const key in groupedSegments) {
                        const groupSegments = groupedSegments[key];
                        const legInfo = processSegments(groupSegments);
                        if (legInfo) {
                            AllLegsInfo.push(legInfo);
                        }
                    }
                    let BookingStatus;
                    if (bookingStatus) {
                        BookingStatus = bookingStatus;
                    }
                    else {
                        BookingStatus = SearchResponse?.BookingStatus;
                    }
                    FlightItenary.push({
                        System: 'FLYHUB',
                        ResultId: Result.ResultID,
                        BookingId: fisId,
                        PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
                        TripType: tripType,
                        SearchId: SearchResponse?.SearchId,
                        BookingStatus: BookingStatus,
                        InstantPayment: Instant_Payment,
                        IsBookable: IsBookable,
                        FareType: FareType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        Cabinclass: Cabinclass,
                        BaseFare: equivalentAmount,
                        Taxes: Taxes,
                        SerViceFee: extraService + servicefee || 0,
                        NetFare: Math.ceil(TotalFare),
                        GrossFare: NetFare,
                        PartialOption: partialoption,
                        PartialFare: Math.ceil(PartialAmount),
                        TimeLimit: TimeLimit,
                        BookingDate: bookingDate,
                        Refundable: Refundable,
                        ExtraService: Result?.ExtraServices || null,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo,
                        PassengerList: SearchResponse?.Passengers,
                    });
                }
            }
        }
        const sslpaymentLink = await this.paymentService.dataModification(FlightItenary, header);
        const price = FlightItenary[0].NetFare;
        const email = await this.authService.decodeToken(header);
        let wallet = await this.walletRepository
            .createQueryBuilder('wallet')
            .innerJoinAndSelect('wallet.user', 'user')
            .where('user.email = :email', { email })
            .getOne();
        const walletAmmount = wallet.ammount;
        let priceAfterPayment = walletAmmount - price;
        if (priceAfterPayment < 0) {
            priceAfterPayment = 0;
        }
        return {
            bookingData: FlightItenary,
            sslpaymentLink,
            walletPayment: { walletAmmount, price, priceAfterPayment },
        };
    }
    async bookingDataTransformerFlyhb(SearchResponse, header, currentTimestamp) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (Results) {
            const DepCountry = Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
            const ArrCountry = Results?.[0]?.segments[0]?.Destination?.Airport?.CountryName;
            let partialoption;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
                partialoption = true;
            }
            else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
                partialoption = true;
            }
            for (const Result of Results) {
                const ValidatingCarrier = Result?.Validatingcarrier;
                const FareType = Result?.FareType || 'Regular';
                const AllPassenger = Result?.Fares || [];
                const CarrierName = Result?.segments[0]?.Airline?.AirlineName || 'N/F';
                const Instant_Payment = Result?.FareType === 'InstantTicketing';
                const IsBookable = Result?.HoldAllowed;
                let discount = Result?.Discount * 0.2;
                let addAmount = 0;
                if (discount < 100) {
                    addAmount = Result?.TotalFareWithAgentMarkup * 0.015;
                }
                const equivalentAmount = AllPassenger.reduce((sum, passenger) => sum + (passenger?.BaseFare * passenger?.PassengerCount || 0), 0);
                let equivalentAmount1 = equivalentAmount + addAmount;
                const Taxes = AllPassenger.reduce((sum, passenger) => sum + (passenger?.Tax * passenger?.PassengerCount || 0), 0);
                const extraService = AllPassenger.reduce((sum, passenger) => sum + (passenger?.OtherCharges * passenger?.PassengerCount || 0), 0);
                const servicefee = AllPassenger.reduce((sum, passenger) => sum + (passenger?.ServiceFee * passenger?.PassengerCount || 0), 0);
                let TotalFare = Result?.TotalFareWithAgentMarkup + addAmount + discount || 0;
                if (Result?.segments) {
                    const AllSegments = Result?.segments;
                    let Cabinclass = AllSegments?.Airline?.CabinClass;
                    const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = Result?.IsRefundable;
                    let TimeLimit = null;
                    if (Result?.LastTicketDate) {
                        const lastTicketDate = Result?.LastTicketDate;
                        TimeLimit = `${lastTicketDate}`;
                    }
                    const PriceBreakDown = AllPassenger.map((allPassenger) => {
                        const PaxType = allPassenger?.PaxType;
                        const paxCount = allPassenger?.PassengerCount;
                        const basefare = allPassenger?.BaseFare + addAmount;
                        const othercharge = allPassenger?.OtherCharges;
                        const servicefee = allPassenger?.ServiceFee;
                        const totalTaxAmount = allPassenger?.Tax;
                        const PaxtotalFare = basefare + totalTaxAmount + servicefee + othercharge;
                        const PaxequivalentAmount = basefare;
                        const baggageDetails = AllSegments.map((segment) => {
                            let allowance = '';
                            const allPaxBaggage = segment?.baggageDetails?.find((baggage) => baggage?.IsAllPax === true);
                            if (allPaxBaggage) {
                                allowance = allPaxBaggage?.Checkin || '';
                            }
                            else {
                                allowance =
                                    segment?.baggageDetails
                                        ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType)
                                        .map((baggage) => baggage?.Checkin)[0] || '';
                            }
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: allowance || '',
                            };
                        });
                        let i = 0;
                        const FareBasis = Result?.segments.map((fareComponent) => {
                            i++;
                            return {
                                Origin: fareComponent?.Origin?.Airport?.AirportCode,
                                Destination: fareComponent?.Destination?.Airport?.AirportCode,
                                DepDate: fareComponent?.Origin?.DepTime,
                                FareBasisCode: fareComponent?.Airline?.BookingClass,
                                Carrier: fareComponent?.Airline?.AirlineCode,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: Math.ceil(PaxequivalentAmount),
                            Taxes: totalTaxAmount,
                            ServiceFee: servicefee,
                            OtherCharges: othercharge,
                            TotalFare: Math.ceil(PaxtotalFare),
                            PaxCount: paxCount,
                            Bag: baggageDetails,
                            FareComponent: FareBasis,
                        };
                    });
                    const processSegments = (segmentsList) => {
                        if (segmentsList.length === 0)
                            return null;
                        const firstSegment = segmentsList[0];
                        const lastSegment = segmentsList[segmentsList.length - 1];
                        const legInfo = {
                            DepDate: firstSegment?.Origin?.DepTime,
                            DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
                            ArrTo: lastSegment.Destination?.Airport?.AirportCode,
                            TotalFlightDuration: segmentsList?.reduce((acc, segment) => acc + parseInt(segment?.JourneyDuration), 0),
                        };
                        const bookingClass = firstSegment?.Airline?.BookingClass;
                        const cabinClass = firstSegment?.Airline?.CabinClass;
                        const seatsAvailable = Result?.Availabilty;
                        const segments = segmentsList?.map((segment) => ({
                            MarketingCarrier: segment?.Airline?.AirlineCode,
                            MarketingCarrierName: segment?.Airline?.AirlineName,
                            MarketingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrier: segment?.Airline?.OperatingCarrier,
                            OperatingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrierName: segment?.Airline?.AirlineName,
                            DepFrom: segment?.Origin?.Airport?.AirportCode,
                            DepAirPort: segment?.Origin?.Airport?.AirportName,
                            DepLocation: `${segment?.Origin?.Airport?.CityName}, ${segment?.Origin?.Airport?.CountryName}`,
                            DepDateAdjustment: 0,
                            DepTime: segment?.Origin?.DepTime,
                            ArrTo: segment?.Destination?.Airport?.AirportCode,
                            ArrAirPort: segment?.Destination?.Airport?.AirportName,
                            ArrLocation: `${segment?.Destination?.Airport?.CityName}, ${segment?.Destination?.Airport?.CountryName}`,
                            ArrDateAdjustment: 0,
                            ArrTime: segment?.Destination?.ArrTime,
                            OperatedBy: segment?.Airline?.AirlineName,
                            StopCount: segment?.StopQuantity,
                            Duration: parseInt(segment?.JourneyDuration),
                            AircraftTypeName: segment?.Equipment,
                            Amenities: {},
                            DepartureGate: segment?.Origin?.Airport?.Terminal || 'TBA',
                            ArrivalGate: segment?.Destination?.Airport?.Terminal || 'TBA',
                            HiddenStops: [],
                            TotalMilesFlown: 0,
                            SegmentCode: {
                                bookingCode: bookingClass,
                                cabinCode: cabinClass,
                                seatsAvailable: seatsAvailable,
                            },
                        }));
                        legInfo['Segments'] = segments;
                        return legInfo;
                    };
                    const groupedSegments = AllSegments?.reduce((acc, segment) => {
                        (acc[segment?.SegmentGroup] =
                            acc[segment?.SegmentGroup] || []).push(segment);
                        return acc;
                    }, {});
                    const AllLegsInfo = [];
                    for (const key in groupedSegments) {
                        const groupSegments = groupedSegments[key];
                        const legInfo = processSegments(groupSegments);
                        if (legInfo) {
                            AllLegsInfo.push(legInfo);
                        }
                    }
                    const randomId = 'FIS' +
                        Math.floor(Math.random() * 10 ** 13)
                            .toString()
                            .padStart(13, '0');
                    let add = new flight_model_1.BookingIdSave();
                    add.flyitSearchId = randomId;
                    add.flyhubId = SearchResponse?.BookingID;
                    await this.bookingIdSave.save(add);
                    FlightItenary.push({
                        System: 'FLYHUB',
                        ResultId: Result.ResultID,
                        BookingId: randomId,
                        PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
                        BookingDate: currentTimestamp || null,
                        SearchId: SearchResponse?.SearchId,
                        BookingStatus: SearchResponse?.BookingStatus,
                        InstantPayment: Instant_Payment,
                        IsBookable: IsBookable,
                        FareType: FareType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        Cabinclass: Cabinclass,
                        BaseFare: equivalentAmount,
                        Taxes: Taxes,
                        SerViceFee: extraService + servicefee || 0,
                        NetFare: Math.ceil(TotalFare),
                        GrossFare: NetFare,
                        PartialOption: partialoption,
                        PartialFare: Math.ceil(PartialAmount),
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        ExtraService: Result?.ExtraServices || null,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo,
                        PassengerList: SearchResponse?.Passengers,
                    });
                }
            }
        }
        const save = await this.saveBookingData(FlightItenary, header);
        const sslpaymentLink = await this.paymentService.dataModification(FlightItenary, header);
        return {
            bookingData: FlightItenary,
            save: save,
            sslpaymentLink,
        };
    }
    async saveBookingData(SearchResponse, header, bookingId) {
        const booking = SearchResponse[0];
        if (booking) {
            const flightNumber = booking.AllLegsInfo[0].Segments[0].MarketingFlightNumber;
            let tripType;
            if (booking.AllLegsInfo.length === 1) {
                tripType = 'OneWay';
            }
            else if (booking.AllLegsInfo.length === 2) {
                if (booking.AllLegsInfo[0].ArrTo === booking.AllLegsInfo[1].DepFrom &&
                    booking.AllLegsInfo[0].DepFrom === booking.AllLegsInfo[1].ArrTo) {
                    tripType = 'Return';
                }
                else {
                    tripType = 'Multicity';
                }
            }
            else {
                tripType = 'Multicity';
            }
            const paxCount = booking.PriceBreakDown.reduce((sum, breakdown) => sum + breakdown.PaxCount, 0);
            const convertedData = {
                system: booking?.System,
                bookingId: bookingId ?? booking?.BookingId,
                paxCount: paxCount,
                Curriername: booking?.CarrierName,
                CurrierCode: booking?.Carrier,
                flightNumber: flightNumber.toString(),
                isRefundable: booking?.Refundable,
                bookingDate: booking?.BookingDate,
                expireDate: booking?.TimeLimit,
                bookingStatus: booking?.BookingStatus,
                PNR: booking?.PNR,
                grossAmmount: booking?.GrossFare,
                netAmmount: booking?.NetFare,
                TripType: tripType,
                laginfo: booking?.AllLegsInfo.map((leg) => ({
                    DepDate: leg?.DepDate,
                    DepFrom: leg?.DepFrom,
                    ArrTo: leg?.ArrTo,
                })),
            };
            const mail = await this.mailService.sendMail(booking);
            return await this.BookService.saveBooking(convertedData, header);
        }
        else {
            return 'Booking data is unvalid';
        }
    }
    async bookingCancelDataTranformerFlyhub(SearchResponse, fisId, header) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (Results) {
            const DepCountry = Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
            const ArrCountry = Results?.[0]?.segments[0]?.Destination?.Airport?.CountryName;
            let partialoption;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
                partialoption = true;
            }
            else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
                partialoption = true;
            }
            for (const Result of Results) {
                const ValidatingCarrier = Result?.Validatingcarrier;
                const FareType = Result?.FareType || 'Regular';
                const AllPassenger = Result?.Fares || [];
                const CarrierName = Result?.segments[0]?.Airline?.AirlineName || 'N/F';
                const Instant_Payment = Result?.FareType === 'InstantTicketing';
                const IsBookable = Result?.HoldAllowed;
                let discount = Result?.Discount * 0.2;
                let addAmount = 0;
                if (discount < 100) {
                    addAmount = Result?.TotalFareWithAgentMarkup * 0.015;
                }
                const equivalentAmount = AllPassenger.reduce((sum, passenger) => sum + (passenger?.BaseFare * passenger?.PassengerCount || 0), 0);
                let equivalentAmount1 = equivalentAmount + addAmount;
                const Taxes = AllPassenger.reduce((sum, passenger) => sum + (passenger?.Tax * passenger?.PassengerCount || 0), 0);
                const extraService = AllPassenger.reduce((sum, passenger) => sum + (passenger?.OtherCharges * passenger?.PassengerCount || 0), 0);
                const servicefee = AllPassenger.reduce((sum, passenger) => sum + (passenger?.ServiceFee * passenger?.PassengerCount || 0), 0);
                let TotalFare = Result?.TotalFareWithAgentMarkup + addAmount + discount || 0;
                if (Result?.segments) {
                    const AllSegments = Result?.segments;
                    let Cabinclass = AllSegments?.Airline?.CabinClass;
                    const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = Result?.IsRefundable;
                    let TimeLimit = null;
                    if (Result?.LastTicketDate) {
                        const lastTicketDate = Result?.LastTicketDate;
                        TimeLimit = `${lastTicketDate}`;
                    }
                    const PriceBreakDown = AllPassenger.map((allPassenger) => {
                        const PaxType = allPassenger?.PaxType;
                        const paxCount = allPassenger?.PassengerCount;
                        const basefare = allPassenger?.BaseFare + addAmount;
                        const othercharge = allPassenger?.OtherCharges;
                        const servicefee = allPassenger?.ServiceFee;
                        const totalTaxAmount = allPassenger?.Tax;
                        const PaxtotalFare = basefare + totalTaxAmount + servicefee + othercharge;
                        const PaxequivalentAmount = basefare;
                        const baggageDetails = AllSegments.map((segment) => {
                            let allowance = '';
                            const allPaxBaggage = segment?.baggageDetails?.find((baggage) => baggage?.IsAllPax === true);
                            if (allPaxBaggage) {
                                allowance = allPaxBaggage?.Checkin || '';
                            }
                            else {
                                allowance =
                                    segment?.baggageDetails
                                        ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType)
                                        .map((baggage) => baggage?.Checkin)[0] || '';
                            }
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: allowance || '',
                            };
                        });
                        let i = 0;
                        const FareBasis = Result?.segments.map((fareComponent) => {
                            i++;
                            return {
                                Origin: fareComponent?.Origin?.Airport?.AirportCode,
                                Destination: fareComponent?.Destination?.Airport?.AirportCode,
                                DepDate: fareComponent?.Origin?.DepTime,
                                FareBasisCode: fareComponent?.Airline?.BookingClass,
                                Carrier: fareComponent?.Airline?.AirlineCode,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: Math.ceil(PaxequivalentAmount),
                            Taxes: totalTaxAmount,
                            ServiceFee: servicefee,
                            OtherCharges: othercharge,
                            TotalFare: Math.ceil(PaxtotalFare),
                            PaxCount: paxCount,
                            Bag: baggageDetails,
                            FareComponent: FareBasis,
                        };
                    });
                    const processSegments = (segmentsList) => {
                        if (segmentsList.length === 0)
                            return null;
                        const firstSegment = segmentsList[0];
                        const lastSegment = segmentsList[segmentsList.length - 1];
                        const legInfo = {
                            DepDate: firstSegment?.Origin?.DepTime,
                            DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
                            ArrTo: lastSegment.Destination?.Airport?.AirportCode,
                            TotalFlightDuration: segmentsList?.reduce((acc, segment) => acc + parseInt(segment?.JourneyDuration), 0),
                        };
                        const bookingClass = firstSegment?.Airline?.BookingClass;
                        const cabinClass = firstSegment?.Airline?.CabinClass;
                        const seatsAvailable = Result?.Availabilty;
                        const segments = segmentsList?.map((segment) => ({
                            MarketingCarrier: segment?.Airline?.AirlineCode,
                            MarketingCarrierName: segment?.Airline?.AirlineName,
                            MarketingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrier: segment?.Airline?.OperatingCarrier,
                            OperatingFlightNumber: parseInt(segment?.Airline?.FlightNumber),
                            OperatingCarrierName: segment?.Airline?.AirlineName,
                            DepFrom: segment?.Origin?.Airport?.AirportCode,
                            DepAirPort: segment?.Origin?.Airport?.AirportName,
                            DepLocation: `${segment?.Origin?.Airport?.CityName}, ${segment?.Origin?.Airport?.CountryName}`,
                            DepDateAdjustment: 0,
                            DepTime: segment?.Origin?.DepTime,
                            ArrTo: segment?.Destination?.Airport?.AirportCode,
                            ArrAirPort: segment?.Destination?.Airport?.AirportName,
                            ArrLocation: `${segment?.Destination?.Airport?.CityName}, ${segment?.Destination?.Airport?.CountryName}`,
                            ArrDateAdjustment: 0,
                            ArrTime: segment?.Destination?.ArrTime,
                            OperatedBy: segment?.Airline?.AirlineName,
                            StopCount: segment?.StopQuantity,
                            Duration: parseInt(segment?.JourneyDuration),
                            AircraftTypeName: segment?.Equipment,
                            Amenities: {},
                            DepartureGate: segment?.Origin?.Airport?.Terminal || 'TBA',
                            ArrivalGate: segment?.Destination?.Airport?.Terminal || 'TBA',
                            HiddenStops: [],
                            TotalMilesFlown: 0,
                            SegmentCode: {
                                bookingCode: bookingClass,
                                cabinCode: cabinClass,
                                seatsAvailable: seatsAvailable,
                            },
                        }));
                        legInfo['Segments'] = segments;
                        return legInfo;
                    };
                    const groupedSegments = AllSegments?.reduce((acc, segment) => {
                        (acc[segment?.SegmentGroup] =
                            acc[segment?.SegmentGroup] || []).push(segment);
                        return acc;
                    }, {});
                    const AllLegsInfo = [];
                    for (const key in groupedSegments) {
                        const groupSegments = groupedSegments[key];
                        const legInfo = processSegments(groupSegments);
                        if (legInfo) {
                            AllLegsInfo.push(legInfo);
                        }
                    }
                    FlightItenary.push({
                        System: 'FLYHUB',
                        ResultId: Result.ResultID,
                        BookingId: fisId,
                        PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
                        SearchId: SearchResponse?.SearchId,
                        BookingStatus: SearchResponse?.BookingStatus,
                        InstantPayment: Instant_Payment,
                        IsBookable: IsBookable,
                        FareType: FareType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        Cabinclass: Cabinclass,
                        BaseFare: equivalentAmount,
                        Taxes: Taxes,
                        SerViceFee: extraService + servicefee || 0,
                        NetFare: Math.ceil(TotalFare),
                        GrossFare: NetFare,
                        PartialOption: partialoption,
                        PartialFare: Math.ceil(PartialAmount),
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        ExtraService: Result?.ExtraServices || null,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo,
                        PassengerList: SearchResponse?.Passengers,
                    });
                }
            }
        }
        await this.BookService.cancelDataSave(FlightItenary[0].BookingId, FlightItenary[0].BookingStatus, header);
        await this.mailService.sendMail(FlightItenary[0]);
        return FlightItenary;
    }
};
exports.FlyHubUtil = FlyHubUtil;
exports.FlyHubUtil = FlyHubUtil = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, typeorm_1.InjectRepository)(flight_model_1.BookingIdSave)),
    __param(6, (0, typeorm_1.InjectRepository)(deposit_model_1.Wallet)),
    __metadata("design:paramtypes", [booking_service_1.BookingService,
        mail_service_1.MailService,
        payment_service_1.PaymentService,
        auth_service_1.AuthService,
        transection_service_1.TransectionService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FlyHubUtil);
//# sourceMappingURL=flyhub.util.js.map