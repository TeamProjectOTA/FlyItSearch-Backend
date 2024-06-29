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
        if (FlightItenary) {
            for (const Result of Results) {
                if (Result) {
                    const DepCountry = Result.segments[0]?.Origin.Airport.CountryName;
                    const ArrCountry = Result.segments[0]?.Destination.Airport.CountryName;
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
                    if (Result.segments) {
                        const AllSegments = Result.segments;
                        let TripType;
                        if (AllSegments.length === 1) {
                            TripType = 'Oneway';
                        }
                        else if (AllSegments.length > 1 &&
                            AllSegments[0]?.Origin?.Airport?.AirportCode ===
                                AllSegments[1]?.Destination?.Airport?.AirportCode) {
                            TripType = 'Return';
                        }
                        else if (AllSegments.length > 1 &&
                            AllSegments[0]?.Origin?.Airport?.AirportCode !==
                                AllSegments[1]?.Destination?.Airport?.AirportCode) {
                            TripType = 'Multicity';
                        }
                        const ValidatingCarrier = Result.Validatingcarrier;
                        const airlineData = Result.segments[0].Airline;
                        const FareType = Result.FareType || 'Regular';
                        const AllPassenger = Result.Fares || [];
                        const CarrierName = Result.segments[0].Airline.AirlineName || 'N/F';
                        const Instant_Payment = airlineData.instantPayment || false;
                        const IssuePermit = airlineData.issuePermit || false;
                        const IsBookable = airlineData.bookable === '0' ? false : true;
                        const equivalentAmount = AllPassenger[0]?.BaseFare || 0;
                        const Taxes = AllPassenger[0]?.Tax || 0;
                        let TotalFare = Result.TotalFare || 0;
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
                            case 'J':
                                Class = 'Premium Business';
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
                                    .map((baggage) => baggage.Checkin);
                                if (baggage.check)
                                     || [];
                                return {
                                    Airline: ValidatingCarrier,
                                    Allowance: allowance,
                                };
                            });
                            return {
                                PaxType: PaxType,
                                BaseFare: PaxequivalentAmount,
                                Taxes: totalTaxAmount,
                                TotalFare: PaxtotalFare,
                                PaxCount: paxCount,
                                Bag: baggageDetails,
                                FareComponent: [
                                    {
                                        Origin: AllSegments[0].Origin.Airport.AirportCode,
                                        Destination: AllSegments[0].Destination.Airport.AirportCode,
                                        DepDate: AllSegments[0].Origin.DepTime,
                                        FareBasisCode: cabinclass,
                                        Carrier: ValidatingCarrier,
                                    },
                                ],
                            };
                        });
                        const AllLegsInfo = [];
                        for (const segment of AllSegments) {
                            const legInfo = {
                                DepDate: segment.Origin.DepTime,
                                DepFrom: segment.Origin.Airport.AirportCode,
                                ArrTo: segment.Destination.Airport.AirportCode,
                                Duration: segment.JourneyDuration,
                            };
                            const SingleSegments = {
                                MarketingCarrier: segment.Airline.AirlineCode,
                                MarketingCarrierName: segment.Airline.AirlineName,
                                MarketingFlightNumber: segment.Airline.FlightNumber,
                                OperatingCarrier: segment.Airline.OperatingCarrier,
                                OperatingFlightNumber: segment.Airline.FlightNumber,
                                OperatingCarrierName: segment.Airline.OperatingCarrier,
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
                                OperatedBy: segment.Airline.OperatingCarrier,
                                StopCount: segment.StopQuantity,
                                Duration: segment.JourneyDuration,
                                AircraftTypeName: segment.Equipment,
                                DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
                                ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
                                HiddenStops: [],
                                TotalMilesFlown: 0,
                                SegmentCode: segment.Airline.FlightNumber,
                            };
                            legInfo['Segments'] = [SingleSegments];
                            AllLegsInfo.push(legInfo);
                        }
                        FlightItenary.push({
                            ResultId: Result.ResultID,
                            OfferId: SearchResponse?.SearchId,
                            System: 'FLYHUB',
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