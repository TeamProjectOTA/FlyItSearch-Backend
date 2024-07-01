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
    async restBFMParser(SearchResponse, journeyType) {
        const FlightItenary = [];
        const { Results } = SearchResponse;
        const PaxTypeMapping = {
            Adult: 1,
            Child: 2,
            Infant: 3,
        };
        if (FlightItenary) {
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
                if (Results[0].segments) {
                    const AllSegments = Results[0].segments;
                    let TripType;
                    if (journeyType === "1") {
                        TripType = 'Oneway';
                    }
                    else if (journeyType === "2") {
                        TripType = 'Return';
                    }
                    else if (journeyType === "3") {
                        TripType = 'Multicity';
                    }
                    for (const Result of Results) {
                        const ValidatingCarrier = Result.Validatingcarrier;
                        const airlineData = Result.segments[0].Airline;
                        const FareType = Result.FareType || 'Regular';
                        const AllPassenger = Result.Fares || [];
                        const CarrierName = Result.segments[0].Airline.AirlineName || 'N/F';
                        const Instant_Payment = airlineData.instantPayment || false;
                        const IssuePermit = airlineData.issuePermit || false;
                        const IsBookable = Result?.HoldAllowed;
                        const equivalentAmount = AllPassenger[0]?.BaseFare || 0;
                        const Taxes = AllPassenger[0]?.Tax || 0;
                        let TotalFare = Result.TotalFare || 0;
                        const extraService = Result?.ExtraServices || [];
                        const addAmount = airlineData.addAmount || 0;
                        const NetFare = equivalentAmount + addAmount + Taxes;
                        if (NetFare > TotalFare) {
                            TotalFare = NetFare;
                        }
                        const PartialAmount = NetFare * 0.3;
                        const Refundable = Result.IsRefundable;
                        let TimeLimit = null;
                        if (Result.LastTicketDate) {
                            const lastTicketDate = Result.LastTicketDate;
                            TimeLimit = `${lastTicketDate}T23:59:00`;
                        }
                        let cabinclass = AllSegments[0]?.Airline?.CabinClass || 'Y';
                        let Class;
                        switch (cabinclass) {
                            case 'P':
                                Class = 'First';
                                break;
                            case 'C':
                                Class = 'Business';
                                break;
                            case 'S':
                                Class = 'Premium Economy';
                                break;
                            case 'Y':
                                Class = 'Economy';
                                break;
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
                                    .map((baggage) => baggage.Checkin) || [];
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
                                    DepDate: fareComponent[i - 1]?.departureDate || fareComponent[0]?.departureDate,
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
                                FareComponent: FareBasis
                            };
                        });
                        const AllLegsInfo = [];
                        const segments = [];
                        const firstSegment = Result.segments[0];
                        const lastSegment = Result.segments[Result.segments.length - 1];
                        const legInfo = {
                            DepDate: firstSegment.Origin.DepTime,
                            DepFrom: firstSegment.Origin.Airport.AirportCode,
                            ArrTo: lastSegment.Destination.Airport.AirportCode,
                            Duration: Result.segments.reduce((acc, segment) => acc + parseInt(segment.JourneyDuration), 0)
                        };
                        const bookingClass = firstSegment.Airline?.BookingClass;
                        const cabinClass = firstSegment.Airline?.CabinClass;
                        const seatsAvailable = Result.Availabilty;
                        for (const segment of Result.segments) {
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
                                    seatsAvailable: seatsAvailable
                                }
                            };
                            segments.push(SingleSegments);
                        }
                        legInfo['Segments'] = segments;
                        AllLegsInfo.push(legInfo);
                        FlightItenary.push({
                            System: 'FLYHUB',
                            ResultId: Result.ResultID,
                            OfferId: SearchResponse?.SearchId,
                            FarePolicy: farepolicy,
                            InstantPayment: Instant_Payment,
                            IssuePermit: IssuePermit,
                            IsBookable: IsBookable,
                            TripType: TripType,
                            FareType: FareType,
                            Carrier: ValidatingCarrier,
                            CarrierName: CarrierName,
                            Cabinclass: Class,
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
        return [];
    }
};
exports.FlyHubUtil = FlyHubUtil;
exports.FlyHubUtil = FlyHubUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FlyHubUtil);
//# sourceMappingURL=flyhub.util.js.map