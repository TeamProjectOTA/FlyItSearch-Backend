import { Injectable } from '@nestjs/common';


@Injectable()
export class FlyHubUtil {
  constructor() {}
  async restBFMParser(SearchResponse: any,journeyType:any): Promise<any[]> {
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

         
           for(const Result of Results){
            const ValidatingCarrier: string = Result.Validatingcarrier;
            const airlineData: any = Result.segments[0].Airline;
            const FareType: string = Result.FareType || 'Regular';
            const AllPassenger: any[] = Result.Fares || [];
            const CarrierName: string =
              Result.segments[0].Airline.AirlineName || 'N/F';
            const Instant_Payment: boolean =
            Result.FareType=="InstantTicketing"?true: false;
            const IssuePermit: boolean = airlineData.issuePermit || false;
            const IsBookable: boolean =
              Result?.HoldAllowed;


             ////Mark up ammount section

             

            const equivalentAmount: number = AllPassenger[0]?.BaseFare || 0;
            const Taxes: number = AllPassenger[0]?.Tax || 0;
            let TotalFare: number = Result.TotalFare || 0;
            const extraService:number=Result?.OtherCharges|| 0;
            //const addAmount: number = Result?.ServiceFee || 0;
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

           
            if (Results[0].segments) {
              const AllSegments = Results[0].segments;
  
              let TripType: string;
              if (journeyType === "1") {
                TripType = 'Oneway';
              } else if (
                journeyType === "2" 
              ) {
                TripType = 'Return';
              } else if (
                journeyType === "3"
              ) {
                TripType = 'Multicity';
              }

            const NetFare = equivalentAmount +Taxes+extraService;

            // if (NetFare > TotalFare) {
            //   TotalFare = NetFare;
            // }

            const PartialAmount: number = NetFare * 0.3;

            const Refundable: boolean = Result.IsRefundable;
            let TimeLimit: string = null;
            if (Result.LastTicketDate) {
              const lastTicketDate: string = Result.LastTicketDate;
              TimeLimit = `${lastTicketDate}`;//modification needed
            }
            

            let cabinclass: string = AllSegments?.Airline?.CabinClass || 'Y';
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
              case 'Y'&&'M':
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
                const allowance = segment.baggageDetails
                    ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
                    .map((baggage) => baggage.Checkin)[0] || ""; // Get the first element or an empty string if none
            
                return {
                    Airline: ValidatingCarrier,
                    Allowance: allowance,
                };
            });
              let i = 0;
const FareBasis = Result?.segments.map(
  (fareComponent) => {
    i++;
    return {
      Origin: fareComponent.Origin.Airport.AirportCode,
      Destination: fareComponent.Destination.Airport.AirportCode,
      DepDate: fareComponent[i - 1]?.departureDate || fareComponent[0]?.departureDate,
      FareBasisCode: fareComponent.Airline.FareBasisCode,
      Carrier: fareComponent.Airline.GoverningCarrier,
    };
  },
);

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
  // const seatsAvailable = segment.Availabilty;
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
