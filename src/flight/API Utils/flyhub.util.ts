import { Injectable } from "@nestjs/common";
import { AirlinesService } from "src/airlines/airlines.service";
import { AirportsService } from "src/airports/airports.service";
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class FlyHubUtil{
  constructor(  ){}
    async restBFMParser(SearchResponses: any[]): Promise<any[]> {
        const FlightItenary = [];
        for (const SearchResponse of SearchResponses) {
          if (SearchResponse) {
            
    
            const DepCountry = SearchResponse?.segments.Origin.Airport.CountryName
            const ArrCountry = SearchResponse?.segments.Destination.Airport.CountryName
    
            let farepolicy: string;
            let partialoption: boolean;
            if (DepCountry === 'BD' && ArrCountry === 'BD') {
              farepolicy = 'domestic';
              partialoption = false;
            } else if (DepCountry != 'BD' && ArrCountry != 'BD') {
              farepolicy = 'soto';
              partialoption = false;
            } else if (DepCountry != 'BD' && ArrCountry === 'BD') {
              farepolicy = 'soti';
              partialoption = true;
            } else if (DepCountry === 'BD' && ArrCountry != 'BD') {
              farepolicy = 'sito';
              partialoption = true;
            }
    
            if (SearchResponse?.segments) {
              const AllSegments = SearchResponse?.segments;
    
              let TripType: string;
              if (AllSegments.length === 1) {
                TripType = 'Oneway';
              } else if (AllSegments.length > 1 && (AllSegments[0]?.Origin?.Airport?.AirportCode === AllSegments[1]?.Destination?.Airport?.AirportCode)) {
                TripType = 'Return';
              } else if (AllSegments.length > 1 && (AllSegments[0]?.Origin?.Airport?.AirportCode !== AllSegments[1]?.Destination?.Airport?.AirportCode)) {
                TripType = 'Multicity';
              }
    
              const ValidatingCarrier: string = SearchResponse['Validatingcarrier'];
              const airlineData: any = SearchResponse?.Results.segments.Airline
              const FareType: string = SearchResponse['FareType'] || "Regular";
              const AllPassenger: any[] = SearchResponse['Fares'];
              const CarrierName: string =SearchResponse.segments.Airline.OperatingCarrier || 'N/F';
              const Instant_Payment: boolean = airlineData?.instantPayment; //Whats THis
              const IssuePermit: boolean = airlineData?.issuePermit;
              const IsBookable: boolean = airlineData?.bookable;
              const equivalentAmount: number = AllPassenger[0]['BaseFare'];
              const Taxes: number = AllPassenger[0]['Tax'];
              let TotalFare: number = SearchResponse['TotalFare'];
    
              const addAmount: number = airlineData?.addAmount;
              let ComissionPolicy: number = 0;
              if (farepolicy === 'soti') {
                ComissionPolicy = airlineData?.soti;
              } else if (farepolicy === 'soto') {
                ComissionPolicy = airlineData?.soto;
              } else if (farepolicy === 'sito') {
                ComissionPolicy = airlineData?.sito;
              } else if (farepolicy === 'domestic') {
                ComissionPolicy = airlineData?.domestic;
              }
    
              const NetFare = equivalentAmount + addAmount + Taxes;
    
              if (NetFare > TotalFare) {
                TotalFare = NetFare;
              }
    
              const PartialAmount: number = NetFare * 0.30;
    
              const Refundable: boolean = SearchResponse['IsRefundable'];
              let TimeLimit: string = null;
              if (SearchResponse['LastTicketDate']) {
                const lastTicketDate: string = SearchResponse['LastTicketDate'];
                TimeLimit = `${lastTicketDate}T23:59:00`;
              }
    
              let cabinclass: string = AllPassenger[0]?.CabinClass || 'Y';
              let Class: string;
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
    
              const PriceBreakDown: any[] = AllPassenger?.map(allPassenger => {
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
                  MarketingCarrierName:segment?.Airline?.AirlineName,
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
                OfferId: uuidv4(),
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
   

   
}