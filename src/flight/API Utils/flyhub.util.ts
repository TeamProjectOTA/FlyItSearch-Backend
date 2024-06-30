import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FlyHubUtil {
  constructor() {}
  async restBFMParser(SearchResponse: any): Promise<any[]> {
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
          const ArrCountry =
          Results[0].segments[0]?.Destination.Airport.CountryName;

          let farepolicy: string;
          let partialoption: boolean;
          if (DepCountry === 'BD' && ArrCountry === 'BD') {
            farepolicy = 'domestic';
            partialoption = false;
          } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
            farepolicy = 'soto';
            partialoption = false;
          } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
            farepolicy = 'soti';
            partialoption = true;
          } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
            farepolicy = 'sito';
            partialoption = true;
          }

          if (Results[0].segments) {
            const AllSegments = Results[0].segments;

            let TripType: string;
            if (AllSegments.length === 1) {
              TripType = 'Oneway';
            } else if (
              AllSegments.length > 1 &&
              AllSegments[0]?.Origin?.Airport?.AirportCode ===
                AllSegments[1]?.Destination?.Airport?.AirportCode
            ) {
              TripType = 'Return';
            } else if (
              AllSegments.length > 1 &&
              AllSegments[0]?.Origin?.Airport?.AirportCode !==
                AllSegments[1]?.Destination?.Airport?.AirportCode
            ) {
              TripType = 'Multicity';
            }
           for(const Result of Results){
            const ValidatingCarrier: string = Result.Validatingcarrier;
            const airlineData: any = Result.segments[0].Airline;
            const FareType: string = Result.FareType || 'Regular';
            const AllPassenger: any[] = Result.Fares || [];
            const CarrierName: string =
              Result.segments[0].Airline.AirlineName || 'N/F';
            const Instant_Payment: boolean =
              airlineData.instantPayment || false;
            const IssuePermit: boolean = airlineData.issuePermit || false;
            const IsBookable: boolean =
              Result?.HoldAllowed;
            const equivalentAmount: number = AllPassenger[0]?.BaseFare || 0;
            const Taxes: number = AllPassenger[0]?.Tax || 0;
            let TotalFare: number = Result.TotalFare || 0;
            const extraService: string=Result?.ExtraServices || []

            const addAmount: number = airlineData.addAmount || 0;
            // let ComissionPolicy: number = 0;
            // if (farepolicy === 'soti') {
            //   ComissionPolicy = airlineData.soti || 0;
            // } else if (farepolicy === 'soto') {
            //   ComissionPolicy = airlineData.soto || 0;
            // } else if (farepolicy === 'sito') {
            //   ComissionPolicy = airlineData.sito || 0;
            // } else if (farepolicy === 'domestic') {
            //   ComissionPolicy = airlineData.domestic || 0;
            // }

            const NetFare = equivalentAmount + addAmount + Taxes;

            if (NetFare > TotalFare) {
              TotalFare = NetFare;
            }

            const PartialAmount: number = NetFare * 0.3;

            const Refundable: boolean = Result.IsRefundable;
            let TimeLimit: string = null;
            if (Result.LastTicketDate) {
              const lastTicketDate: string = Result.LastTicketDate;
              TimeLimit = `${lastTicketDate}T23:59:00`;//modification needed
            }

            let cabinclass: string = AllSegments[0]?.Airline?.CabinClass || 'Y';
            let Class: string;
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

            const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
              const PaxType = allPassenger.PaxType;
              const paxCount = allPassenger.PassengerCount;
              const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
              const totalTaxAmount = allPassenger.Tax;
              const PaxequivalentAmount = allPassenger.BaseFare;
              

              const baggageDetails = AllSegments.map((segment) => {
                const allowance =
                  segment.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage.PaxType,
                    )
                    .map((baggage) => baggage.Checkin) || [];

                return {
                  Airline: ValidatingCarrier,
                  Allowance: allowance,
                };
              });
              // let i = 0; // 
              // const FareBasis = allPassenger?.passengerInfo?.fareComponents?.map(
              //   (fareComponent) => {
              //     i++;
              //     const farecompoRef = fareComponent?.ref;
              //     const fareCompo = AllFareCompoDescs[farecompoRef - 1];
              //     return {
              //       Origin: fareComponent?.beginAirport,
              //       Destination: fareComponent?.endAirport,
              //       DepDate:
              //         GroupLegDescs[i - 1]?.departureDate ||
              //         GroupLegDescs[0]?.departureDate,
              //       FareBasisCode: fareCompo.fareBasisCode,
              //       Carrier: fareCompo.governingCarrier,
              //     };
              //   },
              // );

              return {
                PaxType: PaxType,
                BaseFare: PaxequivalentAmount,
                Taxes: totalTaxAmount,
                TotalFare: PaxtotalFare,
                PaxCount: paxCount,
                Bag: baggageDetails,
                FareComponent: "FareBasis"
              };
            });

            const AllLegsInfo = [];
            for (const segment of AllSegments) {
              const legInfo = {
                DepDate: segment.Origin.DepTime,
                DepFrom: segment.Origin.Airport.AirportCode,
                ArrTo: segment.Destination.Airport.AirportCode,
                Duration: parseInt(segment.JourneyDuration),
              };
              const bookingClass=segment.Airline?.BookingClass
              const cabinClass=segment.Airline?.CabinClass
              const seatsAvailable=Result.Availabilty

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
                Amenities:{},
                DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
                ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
                HiddenStops: [],
                TotalMilesFlown: 0,
                
                SegmentCode: {
                  bookingCode:bookingClass,
                  cabinCode: cabinClass,
                  seatsAvailable: seatsAvailable
                },
              };

              legInfo['Segments'] = [SingleSegments];
              AllLegsInfo.push(legInfo);
            }

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
              // Comission: ComissionPolicy,
              TimeLimit: TimeLimit,
              Refundable: Refundable,
              ExtraService:extraService,
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
}
