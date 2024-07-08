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
exports.FlyHubUtil = void 0;
const common_1 = require("@nestjs/common");
let FlyHubUtil = class FlyHubUtil {
    constructor() { }
    async restBFMParser(SearchResponse) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        const journeyType = '1';
        if (Results) {
            const DepCountry = Results?.[0]?.segments[0]?.Origin.Airport.CountryName;
            const ArrCountry = Results?.[0]?.segments[0]?.Destination.Airport.CountryName;
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
                const ValidatingCarrier = Result.Validatingcarrier;
                const airlineData = Result.segments[0].Airline;
                const FareType = Result.FareType || 'Regular';
                const AllPassenger = Result.Fares || [];
                const CarrierName = Result.segments[0].Airline.AirlineName || 'N/F';
                const Instant_Payment = Result.FareType === 'InstantTicketing';
                const IssuePermit = airlineData.issuePermit || false;
                const IsBookable = Result?.HoldAllowed;
                const equivalentAmount = AllPassenger[0]?.BaseFare || 0;
                const Taxes = AllPassenger[0]?.Tax || 0;
                let TotalFare = Result.TotalFare || 0;
                const extraService = Result?.OtherCharges || 0;
                if (Result.segments) {
                    const AllSegments = Result.segments;
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
                    const NetFare = equivalentAmount + Taxes + extraService;
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = Result.IsRefundable;
                    let TimeLimit = null;
                    if (Result.LastTicketDate) {
                        const lastTicketDate = Result.LastTicketDate;
                        TimeLimit = `${lastTicketDate}`;
                    }
                    const PriceBreakDown = AllPassenger.map((allPassenger) => {
                        const PaxType = allPassenger.PaxType;
                        const paxCount = allPassenger.PassengerCount;
                        const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
                        const totalTaxAmount = allPassenger.Tax;
                        const PaxequivalentAmount = allPassenger.BaseFare;
                        const baggageDetails = AllSegments.map((segment) => {
                            const allowance = segment.baggageDetails
                                ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
                                .map((baggage) => baggage.Checkin)[0] || '';
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: allowance,
                            };
                        });
                        let i = 0;
                        const FareBasis = Result?.segments.map((fareComponent) => {
                            i++;
                            return {
                                Origin: fareComponent.Origin.Airport.AirportCode,
                                Destination: fareComponent.Destination.Airport.AirportCode,
                                DepDate: fareComponent.Origin.DepTime,
                                FareBasisCode: fareComponent.Airline.BookingClass,
                                Carrier: fareComponent.Airline.AirlineCode,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: PaxequivalentAmount,
                            Taxes: totalTaxAmount,
                            TotalFare: PaxtotalFare,
                            PaxCount: paxCount,
                            Bag: baggageDetails,
                            FareComponent: FareBasis,
                        };
                    });
                    const inboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'InBound');
                    const outboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'OutBound');
                    const processSegments = (segmentsList) => {
                        if (segmentsList.length === 0)
                            return null;
                        const firstSegment = segmentsList[0];
                        const lastSegment = segmentsList[segmentsList.length - 1];
                        const legInfo = {
                            DepDate: firstSegment.Origin.DepTime,
                            DepFrom: firstSegment.Origin.Airport.AirportCode,
                            ArrTo: lastSegment.Destination.Airport.AirportCode,
                            Duration: segmentsList.reduce((acc, segment) => acc + parseInt(segment.JourneyDuration), 0),
                        };
                        const bookingClass = firstSegment.Airline?.BookingClass;
                        const cabinClass = firstSegment.Airline?.CabinClass;
                        const seatsAvailable = Result.Availabilty;
                        const segments = segmentsList.map(segment => ({
                            MarketingCarrier: segment.Airline.AirlineCode,
                            MarketingCarrierName: segment.Airline.AirlineName,
                            MarketingFlightNumber: parseInt(segment.Airline.FlightNumber),
                            OperatingCarrier: segment.Airline.OperatingCarrier,
                            OperatingFlightNumber: parseInt(segment.Airline.FlightNumber),
                            OperatingCarrierName: segment.Airline.AirlineName,
                            DepFrom: segment.Origin.Airport.AirportCode,
                            DepAirPort: segment.Origin.Airport.AirportName,
                            DepLocation: `${segment.Origin.Airport.CityName}, ${segment.Origin.Airport.CountryName}`,
                            DepDateAdjustment: 0,
                            DepTime: segment.Origin.DepTime,
                            ArrTo: segment.Destination.Airport.AirportCode,
                            ArrAirPort: segment.Destination.Airport.AirportName,
                            ArrLocation: `${segment.Destination.Airport.CityName}, ${segment.Destination.Airport.CountryName}`,
                            ArrDateAdjustment: 0,
                            ArrTime: segment.Destination.ArrTime,
                            OperatedBy: segment.Airline.AirlineName,
                            StopCount: segment.StopQuantity,
                            Duration: parseInt(segment.JourneyDuration),
                            AircraftTypeName: segment.Equipment,
                            Amenities: {},
                            DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
                            ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
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
                    const AllLegsInfo = [];
                    const outboundLegInfo = processSegments(outboundSegments);
                    if (outboundLegInfo) {
                        AllLegsInfo.push(outboundLegInfo);
                    }
                    const inboundLegInfo = processSegments(inboundSegments);
                    if (inboundLegInfo) {
                        AllLegsInfo.push(inboundLegInfo);
                    }
                    FlightItenary.push({
                        System: 'FLYHUB',
                        ResultId: Result.ResultID,
                        OfferId: SearchResponse?.SearchId,
                        InstantPayment: Instant_Payment,
                        IssuePermit: IssuePermit,
                        IsBookable: IsBookable,
                        TripType: TripType,
                        FareType: FareType,
                        Carrier: ValidatingCarrier,
                        CarrierName: CarrierName,
                        Cabinclass: Cabinclass,
                        BaseFare: equivalentAmount,
                        Taxes: Taxes,
                        NetFare: NetFare,
                        GrossFare: TotalFare,
                        PartialOption: partialoption,
                        PartialFare: PartialAmount,
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        ExtraService: extraService,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo,
                    });
                }
            }
        }
        return FlightItenary;
    }
    async priceCheck(SearchResponse) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (Results) {
            const DepCountry = Results[0].segments[0]?.Origin.Airport.CountryName;
            const ArrCountry = Results[0].segments[0]?.Destination.Airport.CountryName;
            let farepolicy;
            let partialoption;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
                farepolicy = 'domestic';
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
                farepolicy = 'soto';
                partialoption = false;
            }
            else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
                farepolicy = 'soti';
                partialoption = true;
            }
            else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
                farepolicy = 'sito';
                partialoption = true;
            }
            const ValidatingCarrier = Results[0].Validatingcarrier;
            const FareType = Results[0].FareType || 'Regular';
            const AllPassenger = Results[0].Fares || [];
            const CarrierName = Results[0].segments[0].Airline.AirlineName || 'N/F';
            const Instant_Payment = Results[0].FareType == 'InstantTicketing' ? true : false;
            const IsBookable = Results[0]?.HoldAllowed;
            const equivalentAmount = AllPassenger[0]?.BaseFare || 0;
            const Taxes = AllPassenger[0]?.Tax || 0;
            let TotalFare = Results[0].TotalFare || 0;
            const extraService = Results[0]?.OtherCharges || 0;
            const NetFare = equivalentAmount + Taxes + extraService;
            const PartialAmount = NetFare * 0.3;
            const Refundable = Results[0].IsRefundable;
            let TimeLimit = null;
            if (Results[0].LastTicketDate) {
                const lastTicketDate = Results[0].LastTicketDate;
                TimeLimit = `${lastTicketDate}`;
            }
            let cabinclass = Results[0].segments[0].Airline?.CabinClass || 'Y';
            const PriceBreakDown = AllPassenger.map((allPassenger) => {
                const PaxType = allPassenger.PaxType;
                const paxCount = allPassenger.PassengerCount;
                const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
                const totalTaxAmount = allPassenger.Tax;
                const PaxequivalentAmount = allPassenger.BaseFare;
                const baggageDetails = Results[0].segments.map((segment) => {
                    const allowance = segment.baggageDetails
                        ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
                        .map((baggage) => baggage.Checkin)[0] || '';
                    return {
                        Airline: ValidatingCarrier,
                        Allowance: allowance,
                    };
                });
                let i = 0;
                const FareBasis = Results[0].segments.map((fareComponent) => {
                    i++;
                    return {
                        Origin: fareComponent.Origin.Airport.AirportCode,
                        Destination: fareComponent.Destination.Airport.AirportCode,
                        DepDate: fareComponent[i - 1]?.departureDate ||
                            fareComponent[0]?.departureDate,
                        FareBasisCode: fareComponent.Airline.FareBasisCode,
                        Carrier: fareComponent.Airline.GoverningCarrier,
                    };
                });
                return {
                    PaxType: PaxType,
                    BaseFare: PaxequivalentAmount,
                    Taxes: totalTaxAmount,
                    TotalFare: PaxtotalFare,
                    PaxCount: paxCount,
                    Bag: baggageDetails,
                    FareComponent: FareBasis,
                };
            });
            const AllLegsInfo = [];
            const segments = [];
            const firstSegment = Results[0].segments[0];
            const lastSegment = Results[0].segments[Results[0].segments.length - 1];
            const legInfo = {
                DepDate: firstSegment.Origin.DepTime,
                DepFrom: firstSegment.Origin.Airport.AirportCode,
                ArrTo: lastSegment.Destination.Airport.AirportCode,
                Duration: Results[0].segments.reduce((acc, segment) => acc + parseInt(segment.JourneyDuration), 0),
            };
            const bookingClass = firstSegment.Airline?.BookingClass;
            const cabinClass = firstSegment.Airline?.CabinClass;
            const seatsAvailable = Results[0].Availabilty;
            const aminites = Results[0]?.ExtraServices || [];
            for (const segment of Results[0].segments) {
                const SingleSegments = {
                    MarketingCarrier: segment.Airline.AirlineCode,
                    MarketingCarrierName: segment.Airline.AirlineName,
                    MarketingFlightNumber: parseInt(segment.Airline.FlightNumber),
                    OperatingCarrier: segment.Airline.OperatingCarrier,
                    OperatingFlightNumber: parseInt(segment.Airline.FlightNumber),
                    OperatingCarrierName: segment.Airline.AirlineName,
                    DepFrom: segment.Origin.Airport.AirportCode,
                    DepAirPort: segment.Origin.Airport.AirportName,
                    DepLocation: `${segment.Origin.Airport.CityName}, ${segment.Origin.Airport.CountryName}`,
                    DepDateAdjustment: 0,
                    DepTime: segment.Origin.DepTime,
                    ArrTo: segment.Destination.Airport.AirportCode,
                    ArrAirPort: segment.Destination.Airport.AirportName,
                    ArrLocation: `${segment.Destination.Airport.CityName}, ${segment.Destination.Airport.CountryName}`,
                    ArrDateAdjustment: 0,
                    ArrTime: segment.Destination.ArrTime,
                    OperatedBy: segment.Airline.AirlineName,
                    StopCount: segment.StopQuantity,
                    Duration: parseInt(segment.JourneyDuration),
                    AircraftTypeName: segment.Equipment,
                    Amenities: {},
                    DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
                    ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
                    HiddenStops: [],
                    TotalMilesFlown: 0,
                    SegmentCode: {
                        bookingCode: bookingClass,
                        cabinCode: cabinClass,
                        seatsAvailable: seatsAvailable,
                    },
                };
                segments.push(SingleSegments);
            }
            legInfo['Segments'] = segments;
            AllLegsInfo.push(legInfo);
            FlightItenary.push({
                System: 'FLYHUB',
                ResultId: Results[0].ResultID,
                OfferId: SearchResponse?.SearchId,
                FarePolicy: farepolicy,
                PassportMadatory: Results[0].PassportMadatory,
                InstantPayment: Instant_Payment,
                IsBookable: IsBookable,
                FareType: FareType,
                Carrier: ValidatingCarrier,
                CarrierName: CarrierName,
                Cabinclass: cabinClass,
                BaseFare: equivalentAmount,
                Taxes: Taxes,
                NetFare: NetFare,
                GrossFare: TotalFare,
                PartialOption: partialoption,
                PartialFare: PartialAmount,
                TimeLimit: TimeLimit,
                Refundable: Refundable,
                ExtraService: aminites,
                PriceBreakDown: PriceBreakDown,
                AllLegsInfo: AllLegsInfo,
                RePriceStatus: SearchResponse?.RePriceStatus,
            });
        }
        return FlightItenary;
    }
};
exports.FlyHubUtil = FlyHubUtil;
exports.FlyHubUtil = FlyHubUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FlyHubUtil);
//# sourceMappingURL=flyhub.util.js.map