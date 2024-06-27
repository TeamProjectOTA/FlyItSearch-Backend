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
const airlines_service_1 = require("../../airlines/airlines.service");
const airports_service_1 = require("../../airports/airports.service");
const uuid_1 = require("uuid");
let FlyHubUtil = class FlyHubUtil {
    constructor(airlinesService, airportsService) {
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async restBFMParser(SearchResponses) {
        const FlightItenary = [];
        for (const SearchResponse of SearchResponses) {
            if (SearchResponse) {
                const DepCountry = SearchResponse?.segments.Origin.Airport.CountryName;
                const ArrCountry = SearchResponse?.Results.segments.Destination.Airport.CountryName;
                let farepolicy;
                let partialoption;
                if (DepCountry === 'BD' && ArrCountry === 'BD') {
                    farepolicy = 'domestic';
                    partialoption = false;
                }
                else if (DepCountry != 'BD' && ArrCountry != 'BD') {
                    farepolicy = 'soto';
                    partialoption = false;
                }
                else if (DepCountry != 'BD' && ArrCountry === 'BD') {
                    farepolicy = 'soti';
                    partialoption = true;
                }
                else if (DepCountry === 'BD' && ArrCountry != 'BD') {
                    farepolicy = 'sito';
                    partialoption = true;
                }
                if (SearchResponse?.segments) {
                    const AllSegments = SearchResponse?.segments;
                    let TripType;
                    if (AllSegments.length === 1) {
                        TripType = 'Oneway';
                    }
                    else if (AllSegments.length > 1 && (AllSegments[0]?.Origin?.Airport?.AirportCode === AllSegments[1]?.Destination?.Airport?.AirportCode)) {
                        TripType = 'Return';
                    }
                    else if (AllSegments.length > 1 && (AllSegments[0]?.Origin?.Airport?.AirportCode !== AllSegments[1]?.Destination?.Airport?.AirportCode)) {
                        TripType = 'Multicity';
                    }
                    const ValidatingCarrier = SearchResponse['Validatingcarrier'];
                    const airlineData = await this.airlinesService.getAirlines(ValidatingCarrier);
                    const FareType = SearchResponse['FareType'] || "Regular";
                    const AllPassenger = SearchResponse['Fares'];
                    const CarrierName = airlineData?.marketing_name || 'N/F';
                    const Instant_Payment = airlineData?.instantPayment;
                    const IssuePermit = airlineData?.issuePermit;
                    const IsBookable = airlineData?.bookable;
                    const equivalentAmount = AllPassenger[0]['BaseFare'];
                    const Taxes = AllPassenger[0]['Tax'];
                    let TotalFare = SearchResponse['TotalFare'];
                    const addAmount = airlineData?.addAmount;
                    let ComissionPolicy = 0;
                    if (farepolicy === 'soti') {
                        ComissionPolicy = airlineData?.soti;
                    }
                    else if (farepolicy === 'soto') {
                        ComissionPolicy = airlineData?.soto;
                    }
                    else if (farepolicy === 'sito') {
                        ComissionPolicy = airlineData?.sito;
                    }
                    else if (farepolicy === 'domestic') {
                        ComissionPolicy = airlineData?.domestic;
                    }
                    const NetFare = equivalentAmount + addAmount + Taxes;
                    if (NetFare > TotalFare) {
                        TotalFare = NetFare;
                    }
                    const PartialAmount = NetFare * 0.30;
                    const Refundable = SearchResponse['IsRefundable'];
                    let TimeLimit = null;
                    if (SearchResponse['LastTicketDate']) {
                        const lastTicketDate = SearchResponse['LastTicketDate'];
                        TimeLimit = `${lastTicketDate}T23:59:00`;
                    }
                    let cabinclass = AllPassenger[0]?.CabinClass || 'Y';
                    let Class;
                    switch (cabinclass) {
                        case 'P':
                            Class = "First";
                            break;
                        case 'J':
                            Class = "Premium Business";
                            break;
                        case 'C':
                            Class = "Business";
                            break;
                        case 'S':
                            Class = "Premium Economy";
                            break;
                        case 'Y':
                            Class = "Economy";
                            break;
                    }
                    const PriceBreakDown = AllPassenger?.map(allPassenger => {
                        const PaxType = allPassenger?.PaxType;
                        const paxCount = allPassenger?.PassengerCount;
                        const PaxtotalFare = allPassenger?.BaseFare + allPassenger?.Tax;
                        const totalTaxAmount = allPassenger?.Tax;
                        const PaxequivalentAmount = allPassenger?.BaseFare;
                        const BaggageAllowance = allPassenger?.Baggage;
                        const Baggage = allPassenger?.baggageDetails?.map(baggageAllowance => {
                            const Allowance = baggageAllowance?.Checkin + 'kg';
                            return {
                                Airline: ValidatingCarrier,
                                Allowance: Allowance,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: PaxequivalentAmount,
                            Taxes: totalTaxAmount,
                            TotalFare: PaxtotalFare,
                            PaxCount: paxCount,
                            Bag: Baggage,
                            FareComponent: [
                                {
                                    Origin: AllSegments[0]?.Origin?.Airport?.AirportCode,
                                    Destination: AllSegments[0]?.Destination?.Airport?.AirportCode,
                                    DepDate: AllSegments[0]?.Origin?.DepTime,
                                    FareBasisCode: cabinclass,
                                    Carrier: ValidatingCarrier
                                }
                            ]
                        };
                    });
                    const AllLegsInfo = [];
                    for (const segment of AllSegments) {
                        const legInfo = {
                            DepDate: segment?.Origin?.DepTime,
                            DepFrom: segment?.Origin?.Airport?.AirportCode,
                            ArrTo: segment?.Destination?.Airport?.AirportCode,
                            Duration: segment?.JourneyDuration
                        };
                        const SingleSegments = {
                            MarketingCarrier: segment?.Airline?.AirlineCode,
                            MarketingCarrierName: segment?.Airline?.AirlineName,
                            MarketingFlightNumber: segment?.Airline?.FlightNumber,
                            OperatingCarrier: segment?.Airline?.OperatingCarrier,
                            OperatingFlightNumber: segment?.Airline?.FlightNumber,
                            OperatingCarrierName: segment?.Airline?.OperatingCarrier,
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
                            OperatedBy: segment?.Airline?.OperatingCarrier,
                            StopCount: segment?.StopQuantity,
                            Duration: segment?.JourneyDuration,
                            AircraftTypeName: segment?.Equipment,
                            DepartureGate: segment?.Origin?.Airport?.Terminal || 'TBA',
                            ArrivalGate: segment?.Destination?.Airport?.Terminal || 'TBA',
                            HiddenStops: [],
                            TotalMilesFlown: 0,
                            SegmentCode: segment?.Airline?.FlightNumber
                        };
                        legInfo['Segments'] = [SingleSegments];
                        AllLegsInfo.push(legInfo);
                    }
                    FlightItenary.push({
                        ResultId: SearchResponse?.ResultID,
                        OfferId: (0, uuid_1.v4)(),
                        System: "FLYHUB",
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
                        Comission: ComissionPolicy,
                        TimeLimit: TimeLimit,
                        Refundable: Refundable,
                        PriceBreakDown: PriceBreakDown,
                        AllLegsInfo: AllLegsInfo
                    });
                }
            }
        }
        return FlightItenary;
    }
};
exports.FlyHubUtil = FlyHubUtil;
exports.FlyHubUtil = FlyHubUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], FlyHubUtil);
//# sourceMappingURL=flyhub.util.js.map