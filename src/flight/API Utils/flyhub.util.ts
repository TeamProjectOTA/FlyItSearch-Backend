import { Injectable } from '@nestjs/common';

@Injectable()
export class FlyHubUtil {
  constructor() {}
  async restBFMParser(
    SearchResponse: any,
    journeyType?: string,
  ): Promise<any[]> {
    const FlightItenary = [];
    const { Results } = SearchResponse;
    const PaxTypeMapping = {
      Adult: 1,
      Child: 2,
      Infant: 3,
    };

    if (Results) {
      const DepCountry = Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
      const ArrCountry =
        Results?.[0]?.segments[0]?.Destination?.Airport?.CountryName;

      let partialoption: boolean;
      if (DepCountry === 'BD' && ArrCountry === 'BD') {
        partialoption = false;
      } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
        partialoption = false;
      } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
        partialoption = true;
      } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
        partialoption = true;
      }

      for (const Result of Results) {
        const ValidatingCarrier: string = Result?.Validatingcarrier;
        const FareType: string = Result?.FareType || 'Regular';
        const AllPassenger: any[] = Result?.Fares || [];
        const CarrierName: string =
          Result?.segments[0]?.Airline?.AirlineName || 'N/F';
        const Instant_Payment: boolean = Result?.FareType === 'InstantTicketing';
        const IsBookable: boolean = Result?.HoldAllowed;




        //Price fixing and adding MarkUp ammount
        let discount: number = Result?.Discount * 0.2;

        let addAmount: number = 0;

        if (discount < 100) {
          addAmount = Result?.TotalFareWithAgentMarkup * 0.015;
        }

        const equivalentAmount: number = AllPassenger.reduce(
          (sum, passenger) =>
            sum + (passenger?.BaseFare * passenger?.PassengerCount || 0),
          0,
        );
        let equivalentAmount1: number = equivalentAmount + addAmount;

        const Taxes: number = AllPassenger.reduce(
          (sum, passenger) =>
            sum + (passenger?.Tax * passenger?.PassengerCount || 0),
          0,
        );

        const extraService: number = AllPassenger.reduce(
          (sum, passenger) =>
            sum + (passenger?.OtherCharges * passenger?.PassengerCount || 0),
          0,
        );
        const servicefee: number = AllPassenger.reduce(
          (sum, passenger) =>
            sum + (passenger?.ServiceFee * passenger?.PassengerCount || 0),
          0,
        );
        //Fixed price for less profitable tickets markupadd

        let TotalFare: number =
          Result?.TotalFareWithAgentMarkup + addAmount + discount || 0;

        if (Result?.segments) {
          const AllSegments = Result?.segments;
          let Cabinclass: string = AllSegments?.Airline?.CabinClass;

          let TripType: string;
          if (journeyType === '1') {
            TripType = 'Oneway';
          } else if (journeyType === '2') {
            TripType = 'Return';
          } else if (journeyType === '3') {
            TripType = 'Multicity';
          }

          const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
          const PartialAmount: number = NetFare * 0.3;
          const Refundable: boolean = Result?.IsRefundable;
          let TimeLimit: string = null;
          if (Result?.LastTicketDate) {
            const lastTicketDate: string = Result?.LastTicketDate;
            TimeLimit = `${lastTicketDate}`;
          }

          const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
            const PaxType = allPassenger?.PaxType;
            const paxCount = allPassenger?.PassengerCount;
            //Fixed price for less profitable tickets markup add
            const basefare = allPassenger?.BaseFare + addAmount;

            const servicefee = allPassenger?.ServiceFee;
            const totalTaxAmount = allPassenger?.Tax;
            const PaxtotalFare = basefare + totalTaxAmount + servicefee;
            const PaxequivalentAmount = basefare;

            const baggageDetails = AllSegments.map((segment) => {
              const allowance =
                segment?.baggageDetails
                  ?.filter(
                    (baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType,
                  )
                  .map((baggage) => baggage?.Checkin)[0] || '';

              return {
                Airline: ValidatingCarrier,
                Allowance: allowance || 'SB',
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
              BaseFare: PaxequivalentAmount,
              Taxes: totalTaxAmount,
              ServiceFee: servicefee,
              TotalFare: PaxtotalFare,
              PaxCount: paxCount,
              Bag: baggageDetails,
              FareComponent: FareBasis,
            };
          });

          const processSegments = (segmentsList) => {
            if (segmentsList.length === 0) return null;

            const firstSegment = segmentsList[0];
            const lastSegment = segmentsList[segmentsList.length - 1];

            const legInfo = {
              DepDate: firstSegment?.Origin?.DepTime,
              DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
              ArrTo: lastSegment.Destination?.Airport?.AirportCode,
              TotalFlightDuration: segmentsList?.reduce(
                (acc, segment) => acc + parseInt(segment?.JourneyDuration),
                0,
              ),
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
            (acc[segment?.SegmentGroup] = acc[segment?.SegmentGroup] || []).push(
              segment,
            );
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
            PassportMadatory:
              Result?.PassportMadatory ,
            InstantPayment: Instant_Payment,
            IsBookable: IsBookable,
            TripType: TripType ,
            FareType: FareType,
            Carrier: ValidatingCarrier,
            CarrierName: CarrierName,
            Cabinclass: Cabinclass,
            BaseFare: equivalentAmount,
            Taxes: Taxes,
            SerViceFee: extraService + servicefee || 0,
            NetFare: Math.ceil(TotalFare), //change this before deploy
            GrossFare: NetFare,
            PartialOption: partialoption,
            PartialFare: Math.ceil(PartialAmount),
            TimeLimit: TimeLimit,
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

  // async priceCheck(SearchResponse: any) {
  //   const FlightItenary = [];
  //   const { Results } = SearchResponse;
  //   const PaxTypeMapping = {
  //     Adult: 1,
  //     Child: 2,
  //     Infant: 3,
  //   };

  //   if (Results) {
  //     const DepCountry = Results[0].segments[0]?.Origin.Airport.CountryName;
  //     const ArrCountry =
  //       Results[0].segments[0]?.Destination.Airport.CountryName;

  //     let farepolicy: string;
  //     let partialoption: boolean;
  //     if (DepCountry === 'BD' && ArrCountry === 'BD') {
  //       farepolicy = 'domestic';
  //       partialoption = false;
  //     } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
  //       farepolicy = 'soto';
  //       partialoption = false;
  //     } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
  //       farepolicy = 'soti';
  //       partialoption = true;
  //     } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
  //       farepolicy = 'sito';
  //       partialoption = true;
  //     }

  //     const ValidatingCarrier: string = Results[0].Validatingcarrier;
  //     const FareType: string = Results[0].FareType || 'Regular';
  //     const AllPassenger: any[] = Results[0].Fares || [];
  //     const CarrierName: string =
  //       Results[0].segments[0].Airline.AirlineName || 'N/F';
  //     const Instant_Payment: boolean =
  //       Results[0].FareType == 'InstantTicketing' ? true : false;

  //     const IsBookable: boolean = Results[0]?.HoldAllowed;

  //     const equivalentAmount: number = AllPassenger[0]?.BaseFare || 0;
  //     const Taxes: number = AllPassenger[0]?.Tax || 0;
  //     let TotalFare: number = Results[0].TotalFare || 0;
  //     const extraService: number = Results[0]?.OtherCharges || 0;

  //     const NetFare = equivalentAmount + Taxes + extraService;
  //     const PartialAmount: number = NetFare * 0.3;

  //     const Refundable: boolean = Results[0].IsRefundable;
  //     let TimeLimit: string = null;
  //     if (Results[0].LastTicketDate) {
  //       const lastTicketDate: string = Results[0].LastTicketDate;
  //       TimeLimit = `${lastTicketDate}`;
  //     }

  //     let cabinclass: string =
  //       Results[0].segments[0].Airline?.CabinClass || 'Y';

  //     const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
  //       const PaxType = allPassenger.PaxType;
  //       const paxCount = allPassenger.PassengerCount;
  //       const PaxtotalFare = allPassenger.BaseFare + allPassenger.Tax;
  //       const totalTaxAmount = allPassenger.Tax;
  //       const PaxequivalentAmount = allPassenger.BaseFare;

  //       const baggageDetails = Results[0].segments.map((segment) => {
  //         const allowance =
  //           segment.baggageDetails
  //             ?.filter((baggage) => PaxTypeMapping[PaxType] === baggage.PaxType)
  //             .map((baggage) => baggage.Checkin)[0] || '';

  //         return {
  //           Airline: ValidatingCarrier,
  //           Allowance: allowance,
  //         };
  //       });

  //       let i = 0;
  //       const FareBasis = Results[0].segments.map((fareComponent) => {
  //         i++;
  //         return {
  //           Origin: fareComponent.Origin.Airport.AirportCode,
  //           Destination: fareComponent.Destination.Airport.AirportCode,
  //           DepDate:
  //             fareComponent[i - 1]?.departureDate ||
  //             fareComponent[0]?.departureDate,
  //           FareBasisCode: fareComponent.Airline.FareBasisCode,
  //           Carrier: fareComponent.Airline.GoverningCarrier,
  //         };
  //       });

  //       return {
  //         PaxType: PaxType,
  //         BaseFare: PaxequivalentAmount,
  //         Taxes: totalTaxAmount,
  //         TotalFare: PaxtotalFare,
  //         PaxCount: paxCount,
  //         Bag: baggageDetails,
  //         FareComponent: FareBasis,
  //       };
  //     });

  //     const AllLegsInfo = [];
  //     const segments = [];

  //     const firstSegment = Results[0].segments[0];
  //     const lastSegment = Results[0].segments[Results[0].segments.length - 1];

  //     const legInfo = {
  //       DepDate: firstSegment.Origin.DepTime,
  //       DepFrom: firstSegment.Origin.Airport.AirportCode,
  //       ArrTo: lastSegment.Destination.Airport.AirportCode,
  //       Duration: Results[0].segments.reduce(
  //         (acc, segment) => acc + parseInt(segment.JourneyDuration),
  //         0,
  //       ),
  //     };

  //     const bookingClass = firstSegment.Airline?.BookingClass;
  //     const cabinClass = firstSegment.Airline?.CabinClass;
  //     const seatsAvailable = Results[0].Availabilty;
  //     const aminites = Results[0]?.ExtraServices || [];

  //     for (const segment of Results[0].segments) {
  //       const SingleSegments = {
  //         MarketingCarrier: segment.Airline.AirlineCode,
  //         MarketingCarrierName: segment.Airline.AirlineName,
  //         MarketingFlightNumber: parseInt(segment.Airline.FlightNumber),
  //         OperatingCarrier: segment.Airline.OperatingCarrier,
  //         OperatingFlightNumber: parseInt(segment.Airline.FlightNumber),
  //         OperatingCarrierName: segment.Airline.AirlineName,
  //         DepFrom: segment.Origin.Airport.AirportCode,
  //         DepAirPort: segment.Origin.Airport.AirportName,
  //         DepLocation: `${segment.Origin.Airport.CityName}, ${segment.Origin.Airport.CountryName}`,
  //         DepDateAdjustment: 0,
  //         DepTime: segment.Origin.DepTime,
  //         ArrTo: segment.Destination.Airport.AirportCode,
  //         ArrAirPort: segment.Destination.Airport.AirportName,
  //         ArrLocation: `${segment.Destination.Airport.CityName}, ${segment.Destination.Airport.CountryName}`,
  //         ArrDateAdjustment: 0,
  //         ArrTime: segment.Destination.ArrTime,
  //         OperatedBy: segment.Airline.AirlineName,
  //         StopCount: segment.StopQuantity,
  //         Duration: parseInt(segment.JourneyDuration),
  //         AircraftTypeName: segment.Equipment,
  //         Amenities: {},
  //         DepartureGate: segment.Origin.Airport.Terminal || 'TBA',
  //         ArrivalGate: segment.Destination.Airport.Terminal || 'TBA',
  //         HiddenStops: [],
  //         TotalMilesFlown: 0,
  //         SegmentCode: {
  //           bookingCode: bookingClass,
  //           cabinCode: cabinClass,
  //           seatsAvailable: seatsAvailable,
  //         },
  //       };
  //       segments.push(SingleSegments);
  //     }

  //     legInfo['Segments'] = segments;
  //     AllLegsInfo.push(legInfo);

  //     FlightItenary.push({
  //       System: 'FLYHUB',
  //       ResultId: Results[0].ResultID,
  //       OfferId: SearchResponse?.SearchId,
  //       FarePolicy: farepolicy,
  //       PassportMadatory: Results[0].PassportMadatory,
  //       InstantPayment: Instant_Payment,
  //       IsBookable: IsBookable,
  //       FareType: FareType,
  //       Carrier: ValidatingCarrier,
  //       CarrierName: CarrierName,
  //       Cabinclass: cabinClass,
  //       BaseFare: equivalentAmount,
  //       Taxes: Taxes,
  //       NetFare: NetFare,
  //       GrossFare: TotalFare,
  //       PartialOption: partialoption,
  //       PartialFare: PartialAmount,
  //       TimeLimit: TimeLimit,
  //       Refundable: Refundable,
  //       ExtraService: aminites,
  //       PriceBreakDown: PriceBreakDown,
  //       AllLegsInfo: AllLegsInfo,
  //       RePriceStatus: SearchResponse?.RePriceStatus,
  //     });
  //   }

  //   return FlightItenary;
  // }







  async bookingDataTransformerFlyhb(
      SearchResponse: any,
    ): Promise<any[]> {
      const FlightItenary = [];
      const { Results } = SearchResponse;
      const PaxTypeMapping = {
        Adult: 1,
        Child: 2,
        Infant: 3,
      };
  
      if (Results) {
        const DepCountry = Results?.[0]?.segments[0]?.Origin.Airport.CountryName;
        const ArrCountry =
          Results?.[0]?.segments[0]?.Destination.Airport.CountryName;
  
        let partialoption: boolean;
        if (DepCountry === 'BD' && ArrCountry === 'BD') {
          partialoption = false;
        } else if (DepCountry !== 'BD' && ArrCountry !== 'BD') {
          partialoption = false;
        } else if (DepCountry !== 'BD' && ArrCountry === 'BD') {
          partialoption = true;
        } else if (DepCountry === 'BD' && ArrCountry !== 'BD') {
          partialoption = true;
        }
  
        for (const Result of Results) {
          const ValidatingCarrier: string = Result.Validatingcarrier;
          const FareType: string = Result.FareType || 'Regular';
          const AllPassenger: any[] = Result.Fares || [];
          const CarrierName: string =
            Result.segments[0].Airline.AirlineName || 'N/F';
          const Instant_Payment: boolean = Result.FareType === 'InstantTicketing';
          const IsBookable: boolean = Result?.HoldAllowed;
          let discount: number = Result.Discount * 0.2;
  
          let addAmount: number = 0;
  
          if (discount < 100) {
            addAmount = Result.TotalFareWithAgentMarkup * 0.015;
          }
  
          const equivalentAmount: number = AllPassenger.reduce(
            (sum, passenger) =>
              sum + (passenger.BaseFare * passenger.PassengerCount || 0),
            0,
          );
          let equivalentAmount1: number = equivalentAmount + addAmount;
  
          const Taxes: number = AllPassenger.reduce(
            (sum, passenger) =>
              sum + (passenger.Tax * passenger.PassengerCount || 0),
            0,
          );
  
          const extraService: number = AllPassenger.reduce(
            (sum, passenger) =>
              sum + (passenger.OtherCharges * passenger.PassengerCount || 0),
            0,
          );
          const servicefee: number = AllPassenger.reduce(
            (sum, passenger) =>
              sum + (passenger.ServiceFee * passenger.PassengerCount || 0),
            0,
          );
          //Fixed price for less profitable tickets
  
          let TotalFare: number =
            Result.TotalFareWithAgentMarkup + addAmount + discount || 0;
  
          if (Result.segments) {
            const AllSegments = Result.segments;
            let Cabinclass: string = AllSegments?.Airline?.CabinClass;
            const NetFare = equivalentAmount1 + Taxes + extraService + servicefee;
            const PartialAmount: number = NetFare * 0.3;
            const Refundable: boolean = Result.IsRefundable;
            let TimeLimit: string = null;
            if (Result.LastTicketDate) {
              const lastTicketDate: string = Result.LastTicketDate;
              TimeLimit = `${lastTicketDate}`;
            }
  
            const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
              const PaxType = allPassenger.PaxType;
              const paxCount = allPassenger.PassengerCount;
              //Fixed price for less profitable tickets
              let basefare = allPassenger.BaseFare + addAmount;
  
              const servicefee = allPassenger.ServiceFee;
              const totalTaxAmount = allPassenger.Tax;
              const PaxtotalFare = basefare + totalTaxAmount + servicefee;
              const PaxequivalentAmount = basefare;
  
              const baggageDetails = AllSegments.map((segment) => {
                const allowance =
                  segment.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage.PaxType,
                    )
                    .map((baggage) => baggage.Checkin)[0] || '';
  
                return {
                  Airline: ValidatingCarrier,
                  Allowance: allowance || 'SB',
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
                ServiceFee: servicefee,
                TotalFare: PaxtotalFare,
                PaxCount: paxCount,
                Bag: baggageDetails,
                FareComponent: FareBasis,
              };
            });
  
            const processSegments = (segmentsList) => {
              if (segmentsList.length === 0) return null;
  
              const firstSegment = segmentsList[0];
              const lastSegment = segmentsList[segmentsList.length - 1];
  
              const legInfo = {
                DepDate: firstSegment.Origin.DepTime,
                DepFrom: firstSegment.Origin.Airport.AirportCode,
                ArrTo: lastSegment.Destination.Airport.AirportCode,
                TotalFlightDuration: segmentsList.reduce(
                  (acc, segment) => acc + parseInt(segment.JourneyDuration),
                  0,
                ),
              };
  
              const bookingClass = firstSegment.Airline?.BookingClass;
              const cabinClass = firstSegment.Airline?.CabinClass;
              const seatsAvailable = Result.Availabilty;
  
              const segments = segmentsList.map((segment) => ({
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
  
            const groupedSegments = AllSegments.reduce((acc, segment) => {
              (acc[segment.SegmentGroup] = acc[segment.SegmentGroup] || []).push(
                segment,
              );
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
              BookingId:SearchResponse?.BookingID,
              PNR:SearchResponse?.Results[0].segments[0].AirlinePNR,
              SearchId: SearchResponse?.SearchId,
              BookingStatus:SearchResponse?.BookingStatus,
              InstantPayment: Instant_Payment,
              IsBookable: IsBookable,
              FareType: FareType,
              Carrier: ValidatingCarrier,
              CarrierName: CarrierName,
              Cabinclass: Cabinclass,
              BaseFare: equivalentAmount,
              Taxes: Taxes,
              SerViceFee: extraService + servicefee || 0,
              NetFare: Math.ceil(TotalFare), //change this before deploy
              GrossFare: NetFare,
              PartialOption: partialoption,
              PartialFare: Math.ceil(PartialAmount),
              TimeLimit: TimeLimit,
              Refundable: Refundable,
              ExtraService: Result?.ExtraServices || null,
              PriceBreakDown: PriceBreakDown,
              AllLegsInfo: AllLegsInfo,
              PassengerList:SearchResponse?.Passengers,
            });
          }
        }
      }
  
      return FlightItenary;
    }
}

