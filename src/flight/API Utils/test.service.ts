import { Injectable } from '@nestjs/common';

@Injectable()
export class Test {

    // async restBFMParser(SearchResponse: any): Promise<any[]> {
    //     const FlightItenary = [];
    //     const { Results } = SearchResponse;
    //     const PaxTypeMapping = {
    //         Adult: 1,
    //         Child: 2,
    //         Infant: 3,
    //     };
    //     const journeyType = '1';
    
    //     if (Results) {
    //         const DepCountry = Results?.[0]?.segments[0]?.Origin.Airport.CountryName;
    //         const ArrCountry = Results?.[0]?.segments[0]?.Destination.Airport.CountryName;
    
    //         let partialoption: boolean;
    //         if (DepCountry === 'BD' && ArrCountry === 'BD') {
    //             partialoption = false;
    //         } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
    //             partialoption = false;
    //         } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
    //             partialoption = true;
    //         } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
    //             partialoption = true;
    //         }
    
    //         for (const Result of Results) {
    //             const ValidatingCarrier: string = Result.Validatingcarrier;
    //             const airlineData: any = Result.segments[0].Airline;
    //             const FareType: string = Result.FareType || 'Regular';
    //             const AllPassenger: any[] = Result.Fares || [];
    //             const CarrierName: string = Result.segments[0].Airline.AirlineName || 'N/F';
    //             const Instant_Payment: boolean = Result.FareType === 'InstantTicketing';
    //             const IssuePermit: boolean = airlineData.issuePermit || false;
    //             const IsBookable: boolean = Result?.HoldAllowed;
    
    //             const equivalentAmount: number = AllPassenger[0]?.BaseFare || 0;
    //             const Taxes: number = AllPassenger[0]?.Tax || 0;
    //             let TotalFare: number = Result.TotalFare || 0;
    //             const extraService: number = Result?.OtherCharges || 0;
    
    //             if (Result.segments) {
    //                 const AllSegments = Result.segments;
    
    //                 let TripType: string;
    //                 if (journeyType === '1') {
    //                     TripType = 'Oneway';
    //                 } else if (journeyType === '2') {
    //                     TripType = 'Return';
    //                 } else if (journeyType === '3') {
    //                     TripType = 'Multicity';
    //                 }
    
    //                 const NetFare = equivalentAmount + Taxes + extraService;
    //                 const PartialAmount: number = NetFare * 0.3;
    //                 const Refundable: boolean = Result.IsRefundable;
    //                 let TimeLimit: string = null;
    //                 if (Result.LastTicketDate) {
    //                     const lastTicketDate: string = Result.LastTicketDate;
    //                     TimeLimit = `${lastTicketDate}`;
    //                 }
    
    //                 const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
    //                     const PaxType = allPassenger.PaxType;
    //                     const paxCount = allPassenger.PassengerCount;
    //                     const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
    //                     const totalTaxAmount = allPassenger.Tax;
    //                     const PaxequivalentAmount = allPassenger.BaseFare;
    
    //                     const baggageDetails = AllSegments.map((segment) => {
    //                         const allowance =
    //                             segment.baggageDetails
    //                                 ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
    //                                 .map((baggage) => baggage.Checkin)[0] || '';
    
    //                         return {
    //                             Airline: ValidatingCarrier,
    //                             Allowance: allowance,
    //                         };
    //                     });
    
    //                     let i = 0;
    //                     const FareBasis = Result?.segments.map((fareComponent) => {
    //                         i++;
    //                         return {
    //                             Origin: fareComponent.Origin.Airport.AirportCode,
    //                             Destination: fareComponent.Destination.Airport.AirportCode,
    //                             DepDate: fareComponent.Origin.DepTime,
    //                             FareBasisCode: fareComponent.Airline.BookingClass,
    //                             Carrier: fareComponent.Airline.AirlineCode,
    //                         };
    //                     });
    
    //                     return {
    //                         PaxType: PaxType,
    //                         BaseFare: PaxequivalentAmount,
    //                         Taxes: totalTaxAmount,
    //                         TotalFare: PaxtotalFare,
    //                         PaxCount: paxCount,
    //                         Bag: baggageDetails,
    //                         FareComponent: FareBasis,
    //                     };
    //                 });
    
    //                 const AllLegsInfo = {
    //                     Outbound: [],
    //                     Inbound: [],
                        
    //                 };
    //                 const inboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'InBound');
    //                 const outboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'OutBound');
    
    //                 const processSegments = (segmentsList) => {
    //                     if (segmentsList.length === 0) return null;
    
    //                     const firstSegment = segmentsList[0];
    //                     const lastSegment = segmentsList[segmentsList.length - 1];
    
    //                     const legInfo = {
    //                         DepDate: firstSegment.Origin.DepTime,
    //                         DepFrom: firstSegment.Origin.Airport.AirportCode,
    //                         ArrTo: lastSegment.Destination.Airport.AirportCode,
    //                         Duration: segmentsList.reduce(
    //                             (acc, segment) => acc + parseInt(segment.JourneyDuration),
    //                             0,
    //                         ),
    //                     };
    
    //                     const bookingClass = firstSegment.Airline?.BookingClass;
    //                     const cabinClass = firstSegment.Airline?.CabinClass;
    //                     const seatsAvailable = Result.Availabilty;
    
    //                     const segments = segmentsList.map(segment => ({
    //                         MarketingCarrier: segment.Airline.AirlineCode,
    //                         MarketingCarrierName: segment.Airline.AirlineName,
    //                         MarketingFlightNumber: parseInt(segment.Airline.FlightNumber),
    //                         OperatingCarrier: segment.Airline.OperatingCarrier,
    //                         OperatingFlightNumber: parseInt(segment.Airline.FlightNumber),
    //                         OperatingCarrierName: segment.Airline.AirlineName,
    //                         DepFrom: segment.Origin.Airport.AirportCode,
    //                         DepAirPort: segment.Origin.Airport.AirportName,
    //                         DepLocation: `${segment.Origin.Airport.CityName}, ${segment.Origin.Airport.CountryName}`,
    //                         DepDateAdjustment: 0,
    //                         DepTime: segment.Origin.DepTime,
    //                         ArrTo: segment.Destination.Airport.AirportCode,
    //                         ArrAirPort: segment.Destination.Airport.AirportName,
    //                         ArrLocation: `${segment.Destination.Airport.CityName}, ${segment.Destination.Airport.CountryName}`,
    //                         ArrDateAdjustment: 0,
    //                         ArrTime: segment.Destination.ArrTime,
    //                         OperatedBy: segment.Airline.AirlineName,
    //                         StopCount: segment.StopQuantity,
    //                         Duration: parseInt(segment.JourneyDuration),
    //                         AircraftTypeName: segment.Equipment,
    //                         Amenities: {},
    //                         DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
    //                         ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
    //                         HiddenStops: [],
    //                         TotalMilesFlown: 0,
    //                         SegmentCode: {
    //                             bookingCode: bookingClass,
    //                             cabinCode: cabinClass,
    //                             seatsAvailable: seatsAvailable,
    //                         },
    //                     }));
    
    //                     legInfo['Segments'] = segments;
    //                     return legInfo;
    //                 };
    //                 const outboundLegInfo = processSegments(outboundSegments);
    //                 const inboundLegInfo = processSegments(inboundSegments);
                    
    
    //                 if (inboundLegInfo) {
    //                     AllLegsInfo.Inbound.push(inboundLegInfo);
    //                 }
    
    //                 if (outboundLegInfo) {
    //                     AllLegsInfo.Outbound.push(outboundLegInfo);
    //                 }
    
    //                 FlightItenary.push({
    //                     System: 'FLYHUB',
    //                     ResultId: Result.ResultID,
    //                     OfferId: SearchResponse?.SearchId,
    //                     InstantPayment: Instant_Payment,
    //                     IssuePermit: IssuePermit,
    //                     IsBookable: IsBookable,
    //                     TripType: TripType,
    //                     FareType: FareType,
    //                     Carrier: ValidatingCarrier,
    //                     CarrierName: CarrierName,
    //                     Cabinclass: 'Y',
    //                     BaseFare: equivalentAmount,
    //                     Taxes: Taxes,
    //                     NetFare: NetFare,
    //                     GrossFare: TotalFare,
    //                     PartialOption: partialoption,
    //                     PartialFare: PartialAmount,
    //                     TimeLimit: TimeLimit,
    //                     Refundable: Refundable,
    //                     ExtraService: extraService,
    //                     PriceBreakDown: PriceBreakDown,
    //                     AllLegsInfo: AllLegsInfo,
    //                 });
    //             }
    //         }
    //     }
    
    //     return FlightItenary;
    // }
    
    // async restBFMParser(SearchResponse: any): Promise<any[]> {
    //     const FlightItenary = [];
    //     const { Results } = SearchResponse;
    //     const PaxTypeMapping = {
    //         Adult: 1,
    //         Child: 2,
    //         Infant: 3,
    //     };
    //     const journeyType = '1';
    
    //     if (Results) {
    //         const DepCountry = Results?.[0]?.segments[0]?.Origin.Airport.CountryName;
    //         const ArrCountry = Results?.[0]?.segments[0]?.Destination.Airport.CountryName;
    
    //         let partialoption: boolean;
    //         if (DepCountry === 'BD' && ArrCountry === 'BD') {
    //             partialoption = false;
    //         } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
    //             partialoption = false;
    //         } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
    //             partialoption = true;
    //         } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
    //             partialoption = true;
    //         }
    
    //         for (const Result of Results) {
    //             const ValidatingCarrier: string = Result.Validatingcarrier;
    //             const airlineData: any = Result.segments[0].Airline;
    //             const FareType: string = Result.FareType || 'Regular';
    //             const AllPassenger: any[] = Result.Fares || [];
    //             const CarrierName: string = Result.segments[0].Airline.AirlineName || 'N/F';
    //             const Instant_Payment: boolean = Result.FareType === 'InstantTicketing';
    //             const IssuePermit: boolean = airlineData.issuePermit || false;
    //             const IsBookable: boolean = Result?.HoldAllowed;
    
    //             const equivalentAmount: number = AllPassenger[0]?.BaseFare || 0;
    //             const Taxes: number = AllPassenger[0]?.Tax || 0;
    //             let TotalFare: number = Result.TotalFare || 0;
    //             const extraService: number = Result?.OtherCharges || 0;
    
    //             if (Result.segments) {
    //                 const AllSegments = Result.segments;
    
    //                 let TripType: string;
    //                 if (journeyType === '1') {
    //                     TripType = 'Oneway';
    //                 } else if (journeyType === '2') {
    //                     TripType = 'Return';
    //                 } else if (journeyType === '3') {
    //                     TripType = 'Multicity';
    //                 }
    
    //                 const NetFare = equivalentAmount + Taxes + extraService;
    //                 const PartialAmount: number = NetFare * 0.3;
    //                 const Refundable: boolean = Result.IsRefundable;
    //                 let TimeLimit: string = null;
    //                 if (Result.LastTicketDate) {
    //                     const lastTicketDate: string = Result.LastTicketDate;
    //                     TimeLimit = `${lastTicketDate}`;
    //                 }
    
    //                 const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
    //                     const PaxType = allPassenger.PaxType;
    //                     const paxCount = allPassenger.PassengerCount;
    //                     const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
    //                     const totalTaxAmount = allPassenger.Tax;
    //                     const PaxequivalentAmount = allPassenger.BaseFare;
    
    //                     const baggageDetails = AllSegments.map((segment) => {
    //                         const allowance =
    //                             segment.baggageDetails
    //                                 ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
    //                                 .map((baggage) => baggage.Checkin)[0] || '';
    
    //                         return {
    //                             Airline: ValidatingCarrier,
    //                             Allowance: allowance,
    //                         };
    //                     });
    
    //                     let i = 0;
    //                     const FareBasis = Result?.segments.map((fareComponent) => {
    //                         i++;
    //                         return {
    //                             Origin: fareComponent.Origin.Airport.AirportCode,
    //                             Destination: fareComponent.Destination.Airport.AirportCode,
    //                             DepDate: fareComponent.Origin.DepTime,
    //                             FareBasisCode: fareComponent.Airline.BookingClass,
    //                             Carrier: fareComponent.Airline.AirlineCode,
    //                         };
    //                     });
    
    //                     return {
    //                         PaxType: PaxType,
    //                         BaseFare: PaxequivalentAmount,
    //                         Taxes: totalTaxAmount,
    //                         TotalFare: PaxtotalFare,
    //                         PaxCount: paxCount,
    //                         Bag: baggageDetails,
    //                         FareComponent: FareBasis,
    //                     };
    //                 });
    
                    
    //                 const inboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'InBound');
    //                 const outboundSegments = Result.segments.filter(segment => segment.TripIndicator === 'OutBound');
    
    //                 const processSegments = (segmentsList) => {
    //                     if (segmentsList.length === 0) return null;
    
    //                     const firstSegment = segmentsList[0];
    //                     const lastSegment = segmentsList[segmentsList.length - 1];
    
    //                     const legInfo = {
    //                         DepDate: firstSegment.Origin.DepTime,
    //                         DepFrom: firstSegment.Origin.Airport.AirportCode,
    //                         ArrTo: lastSegment.Destination.Airport.AirportCode,
    //                         Duration: segmentsList.reduce(
    //                             (acc, segment) => acc + parseInt(segment.JourneyDuration),
    //                             0,
    //                         ),
    //                     };
    
    //                     const bookingClass = firstSegment.Airline?.BookingClass;
    //                     const cabinClass = firstSegment.Airline?.CabinClass;
    //                     const seatsAvailable = Result.Availabilty;
    
    //                     const segments = segmentsList.map(segment => ({
    //                         MarketingCarrier: segment.Airline.AirlineCode,
    //                         MarketingCarrierName: segment.Airline.AirlineName,
    //                         MarketingFlightNumber: parseInt(segment.Airline.FlightNumber),
    //                         OperatingCarrier: segment.Airline.OperatingCarrier,
    //                         OperatingFlightNumber: parseInt(segment.Airline.FlightNumber),
    //                         OperatingCarrierName: segment.Airline.AirlineName,
    //                         DepFrom: segment.Origin.Airport.AirportCode,
    //                         DepAirPort: segment.Origin.Airport.AirportName,
    //                         DepLocation: `${segment.Origin.Airport.CityName}, ${segment.Origin.Airport.CountryName}`,
    //                         DepDateAdjustment: 0,
    //                         DepTime: segment.Origin.DepTime,
    //                         ArrTo: segment.Destination.Airport.AirportCode,
    //                         ArrAirPort: segment.Destination.Airport.AirportName,
    //                         ArrLocation: `${segment.Destination.Airport.CityName}, ${segment.Destination.Airport.CountryName}`,
    //                         ArrDateAdjustment: 0,
    //                         ArrTime: segment.Destination.ArrTime,
    //                         OperatedBy: segment.Airline.AirlineName,
    //                         StopCount: segment.StopQuantity,
    //                         Duration: parseInt(segment.JourneyDuration),
    //                         AircraftTypeName: segment.Equipment,
    //                         Amenities: {},
    //                         DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
    //                         ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
    //                         HiddenStops: [],
    //                         TotalMilesFlown: 0,
    //                         SegmentCode: {
    //                             bookingCode: bookingClass,
    //                             cabinCode: cabinClass,
    //                             seatsAvailable: seatsAvailable,
    //                         },
    //                     }));
    
    //                     legInfo['Segments'] = segments;
    //                     return legInfo;
    //                 };

    //                 const inboundLegInfo = processSegments(inboundSegments);
    //                 const outboundLegInfo = processSegments(outboundSegments);

    //                 const legsInfo = {
    //                     inboundLegInfo,
    //                     outboundLegInfo,
    //                 };

    //                 FlightItenary.push({
    //                     System: 'FLYHUB',
    //                     ResultId: Result.ResultID,
    //                     OfferId: SearchResponse?.SearchId,
    //                     InstantPayment: Instant_Payment,
    //                     IssuePermit: IssuePermit,
    //                     IsBookable: IsBookable,
    //                     TripType: TripType,
    //                     FareType: FareType,
    //                     Carrier: ValidatingCarrier,
    //                     CarrierName: CarrierName,
    //                     Cabinclass: 'Y',
    //                     BaseFare: equivalentAmount,
    //                     Taxes: Taxes,
    //                     NetFare: NetFare,
    //                     GrossFare: TotalFare,
    //                     PartialOption: partialoption,
    //                     PartialFare: PartialAmount,
    //                     TimeLimit: TimeLimit,
    //                     Refundable: Refundable,
    //                     ExtraService: extraService,
    //                     PriceBreakDown: PriceBreakDown,
    //                     AllLegsInfo: legsInfo,
    //                 });
    //             }
    //         }
    //     }
    
    //     return FlightItenary;
    // }
    
}
