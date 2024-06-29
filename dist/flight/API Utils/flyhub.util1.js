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
exports.flyhubUtil = void 0;
const common_1 = require("@nestjs/common");
const airlines_service_1 = require("../../airlines/airlines.service");
const airports_service_1 = require("../../airports/airports.service");
const uuid_1 = require("uuid");
const airportsData_1 = require("../data/airportsData");
const airlinesData_1 = require("../data/airlinesData");
let flyhubUtil = class flyhubUtil {
    constructor(airlinesService, airportsService) {
        this.airlinesService = airlinesService;
        this.airportsService = airportsService;
    }
    async restBFMParser(SearchResponse) {
        if (SearchResponse?.groupedItineraryResponse?.statistics?.itineraryCount > 0) {
            const DepPlace = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
                .groupDescription?.legDescriptions[0]?.departureLocation;
            const ArrPlace = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
                .groupDescription?.legDescriptions[0]?.arrivalLocation;
            const DepCounty = await this.airportsService.getCountry(DepPlace);
            const ArrCounty = await this.airportsService.getCountry(ArrPlace);
            let farepolicy;
            let partialoption;
            if (DepCounty === 'BD' && ArrCounty === 'BD') {
                farepolicy = 'domestic';
                partialoption = false;
            }
            else if (DepCounty != 'BD' && ArrCounty != 'BD') {
                farepolicy = 'soto';
                partialoption = false;
            }
            else if (DepCounty != 'BD' && ArrCounty === 'BD') {
                farepolicy = 'soti';
                partialoption = true;
            }
            else if (DepCounty === 'BD' && ArrCounty != 'BD') {
                farepolicy = 'sito';
                partialoption = true;
            }
            const FlightItenary = [];
            if (SearchResponse?.groupedItineraryResponse?.itineraryGroups?.[0]
                ?.itineraries) {
                const AllFlights = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
                    .itineraries;
                const AllBaggage = SearchResponse?.groupedItineraryResponse?.baggageAllowanceDescs;
                const AllLegDescs = SearchResponse?.groupedItineraryResponse?.legDescs;
                const AllscheduleDescs = SearchResponse?.groupedItineraryResponse?.scheduleDescs;
                const AllFareCompoDescs = SearchResponse?.groupedItineraryResponse?.fareComponentDescs;
                const GroupLegDescs = SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
                    ?.groupDescription?.legDescriptions;
                let TripType;
                if (GroupLegDescs.length === 1) {
                    TripType = 'Oneway';
                }
                else if (GroupLegDescs.length > 1 &&
                    GroupLegDescs[0]?.departureLocation ===
                        GroupLegDescs[1]?.arrivalLocation) {
                    TripType = 'Return';
                }
                else if (GroupLegDescs.length > 1 &&
                    GroupLegDescs[0]?.departureLocation !==
                        GroupLegDescs[1]?.arrivalLocation) {
                    TripType = 'Multicity';
                }
                for (const flights of AllFlights) {
                    const ValidatingCarrier = flights['pricingInformation'][0]['fare']['validatingCarrierCode'];
                    const airlineData = await this.airlinesService.getAirlines(ValidatingCarrier);
                    const FareType = 'Regular';
                    const AllPassenger = flights['pricingInformation'][0]['fare']['passengerInfoList'];
                    const CarrierName = airlineData?.marketing_name || 'N/F';
                    const Instant_Payment = airlineData?.instantPayment;
                    const IssuePermit = airlineData?.issuePermit;
                    const IsBookable = airlineData?.bookable;
                    const equivalentAmount = flights['pricingInformation'][0]['fare']['totalFare']['equivalentAmount'];
                    const Taxes = flights['pricingInformation'][0]['fare']['totalFare']['totalTaxAmount'];
                    let TotalFare = flights['pricingInformation'][0]['fare']['totalFare']['totalPrice'];
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
                    const NetFare = equivalentAmount +
                        addAmount +
                        Taxes;
                    if (NetFare > TotalFare) {
                        TotalFare = NetFare;
                    }
                    const PartialAmount = NetFare * 0.3;
                    const Refundable = !flights.pricingInformation?.[0].fare.passengerInfoList?.[0]
                        .passengerInfo.nonRefundable;
                    let TimeLimit;
                    if (flights?.pricingInformation?.[0]?.fare?.lastTicketDate) {
                        const lastTicketDate = flights.pricingInformation?.[0]?.fare?.lastTicketDate;
                        const lastTicketTime = flights.pricingInformation?.[0]?.fare?.lastTicketTime;
                        TimeLimit = `${lastTicketDate}T${lastTicketTime}:00`;
                    }
                    let cabinclass = AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]
                        ?.segment?.cabinCode || 'Y';
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
                    const PriceBreakDown = AllPassenger?.map((allPassenger) => {
                        const PaxType = allPassenger?.passengerInfo?.passengerType;
                        const paxCount = allPassenger?.passengerInfo?.passengerNumber;
                        const PaxtotalFare = allPassenger?.passengerInfo?.passengerTotalFare?.totalFare;
                        const totalTaxAmount = allPassenger?.passengerInfo?.passengerTotalFare?.totalTaxAmount;
                        const PaxequivalentAmount = allPassenger?.passengerInfo?.passengerTotalFare?.equivalentAmount;
                        const BaggageAllowance = allPassenger?.passengerInfo?.baggageInformation;
                        const Baggage = BaggageAllowance?.map((baggageAllowance) => {
                            const BagAirlineCode = baggageAllowance?.airlineCode;
                            const AllowanceRef = AllBaggage[baggageAllowance?.allowance?.ref - 1];
                            let Allowance;
                            if (AllowanceRef?.pieceCount) {
                                Allowance = AllowanceRef?.pieceCount + ' Piece';
                            }
                            else {
                                Allowance = AllowanceRef?.weight + ' KG';
                            }
                            return {
                                Airline: BagAirlineCode,
                                Allowance: Allowance,
                            };
                        });
                        let i = 0;
                        const FareBasis = allPassenger?.passengerInfo?.fareComponents?.map((fareComponent) => {
                            i++;
                            const farecompoRef = fareComponent?.ref;
                            const fareCompo = AllFareCompoDescs[farecompoRef - 1];
                            return {
                                Origin: fareComponent?.beginAirport,
                                Destination: fareComponent?.endAirport,
                                DepDate: GroupLegDescs[i - 1]?.departureDate ||
                                    GroupLegDescs[0]?.departureDate,
                                FareBasisCode: fareCompo.fareBasisCode,
                                Carrier: fareCompo.governingCarrier,
                            };
                        });
                        return {
                            PaxType: PaxType,
                            BaseFare: PaxequivalentAmount,
                            Taxes: totalTaxAmount,
                            TotalFare: PaxtotalFare,
                            PaxCount: paxCount,
                            Bag: Baggage,
                            FareComponent: FareBasis,
                        };
                    });
                    const AllLegsInfo = [];
                    const AllLegsData = flights?.pricingInformation?.[0]?.fare?.passengerInfoList[0]
                        ?.passengerInfo?.fareComponents;
                    const LegDescRef = flights?.legs;
                    for (let i = 0; i < Math.min(AllLegsData.length, LegDescRef.length); i++) {
                        const SingleLegs = LegDescRef[i].ref - 1;
                        const legDesc = AllLegDescs[SingleLegs];
                        const LegDuration = legDesc?.elapsedTime;
                        const AllLegs = GroupLegDescs || [];
                        const departureDate = AllLegs[i].departureDate;
                        const legInfo = {
                            DepDate: AllLegs[i]?.departureDate,
                            DepFrom: AllLegs[i]?.departureLocation,
                            ArrTo: AllLegs[i]?.arrivalLocation,
                            Duration: LegDuration,
                        };
                        const segments = [];
                        const legDescRefList = legDesc?.schedules;
                        const allSegments = AllLegsData[i]?.segments;
                        for (let index = 0; index < legDescRefList.length; index++) {
                            try {
                                const singleLegDesc = legDescRefList[index].ref - 1;
                                const Schedules = AllscheduleDescs[singleLegDesc];
                                const DateAdjustment = legDescRefList[index];
                                let AdjustDepDate = 0;
                                let AdjustedDepDate = departureDate;
                                if (DateAdjustment?.departureDateAdjustment) {
                                    AdjustDepDate = DateAdjustment?.departureDateAdjustment;
                                    const departureDateTime = new Date(departureDate);
                                    departureDateTime.setDate(departureDateTime.getDate() + AdjustDepDate);
                                    AdjustedDepDate = new Date(departureDateTime)
                                        .toISOString()
                                        .split('T')[0];
                                }
                                let AdjustedArrDate = AdjustedDepDate;
                                let AdjustArrDate = 0;
                                if (Schedules?.arrival?.dateAdjustment) {
                                    AdjustArrDate = Schedules?.arrival?.dateAdjustment;
                                    const arrivalDateTime = new Date(AdjustedDepDate);
                                    arrivalDateTime.setDate(arrivalDateTime.getDate() + AdjustArrDate);
                                    AdjustedArrDate = new Date(AdjustedDepDate)
                                        .toISOString()
                                        .split('T')[0];
                                }
                                const OperatedBy = Schedules?.arrival?.disclosure ||
                                    Schedules?.carrier?.operating;
                                const SingleSegments = {
                                    MarketingCarrier: Schedules?.carrier?.marketing,
                                    MarketingCarrierName: await this.getAirlineName(Schedules.carrier.marketing),
                                    MarketingFlightNumber: Schedules?.carrier?.marketingFlightNumber,
                                    OperatingCarrier: Schedules?.carrier?.operating,
                                    OperatingFlightNumber: Schedules?.carrier?.operatingFlightNumber,
                                    OperatingCarrierName: await this.getAirlineName(Schedules.carrier.operating),
                                    DepFrom: Schedules?.departure?.airport,
                                    DepAirPort: (await this.getAirports(Schedules.departure.airport))?.name,
                                    DepLocation: (await this.getAirports(Schedules.departure.airport))?.location,
                                    DepDateAdjustment: AdjustDepDate,
                                    DepTime: `${AdjustedDepDate}T${Schedules.departure.time}`,
                                    ArrTo: Schedules?.arrival?.airport,
                                    ArrAirPort: (await this.getAirports(Schedules.arrival.airport)).name,
                                    ArrLocation: (await this.getAirports(Schedules.arrival.airport)).location,
                                    ArrDateAdjustment: AdjustArrDate,
                                    ArrTime: `${AdjustedArrDate}T${Schedules.arrival.time}`,
                                    OperatedBy: await this.airlinesService.getAirlinesName(OperatedBy),
                                    StopCount: Schedules?.stopCount,
                                    Duration: Schedules?.elapsedTime,
                                    AircraftTypeName: Schedules?.carrier?.equipment?.code || 'N/A',
                                    DepartureGate: Schedules?.departure?.terminal || 'TBA',
                                    ArrivalGate: Schedules?.arrival?.terminal || 'TBA',
                                    HiddenStops: Schedules?.hiddenStops || [],
                                    TotalMilesFlown: Schedules?.totalMilesFlown || 0,
                                    SegmentCode: allSegments[index].segment,
                                };
                                segments.push(SingleSegments);
                            }
                            catch (error) {
                                console.error(error.message);
                            }
                        }
                        legInfo['Segments'] = segments;
                        AllLegsInfo.push(legInfo);
                    }
                    FlightItenary.push({
                        ResultId: '',
                        OfferId: (0, uuid_1.v4)(),
                        System: 'Sabre',
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
                        AllLegsInfo: AllLegsInfo,
                    });
                }
            }
            return FlightItenary;
        }
        else {
            return [];
        }
    }
    async getAirports(code) {
        const foundItem = airportsData_1.airportsData.find((item) => item.code === code);
        if (foundItem) {
            return foundItem;
        }
        else {
            return { code: '', name: '', location };
        }
    }
    async getAirlineName(code) {
        const foundItem = airlinesData_1.airlinesData.find((item) => item.code === code);
        if (foundItem) {
            return foundItem.name;
        }
        else {
            return 'N/F';
        }
    }
};
exports.flyhubUtil = flyhubUtil;
exports.flyhubUtil = flyhubUtil = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [airlines_service_1.AirlinesService,
        airports_service_1.AirportsService])
], flyhubUtil);
//# sourceMappingURL=flyhub.util1.js.map