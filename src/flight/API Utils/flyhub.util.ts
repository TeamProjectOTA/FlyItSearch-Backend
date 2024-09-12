import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';

@Injectable()
export class FlyHubUtil {
  constructor(
    private readonly BookService: BookingService,
    private readonly mailService: MailService,
    private readonly paymentService: PaymentService,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave: Repository<BookingIdSave>,
  ) {}
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
      const DepCountry =
        Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
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
        const Instant_Payment: boolean =
          Result?.FareType === 'InstantTicketing';
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
        const equivalentAmount1: number = equivalentAmount + addAmount;

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
          let isAddAmountAdded = false;
          const PriceBreakDown: any[] = AllPassenger.map((allPassenger) => {
            const PaxType = allPassenger?.PaxType;
            const paxCount = allPassenger?.PassengerCount;
            //Fixed price for less profitable tickets markup add
            let basefare;
            if (!isAddAmountAdded) {
              basefare = allPassenger?.BaseFare + addAmount / paxCount;
              isAddAmountAdded = true;
            } else {
              basefare = allPassenger?.BaseFare;
            }
            const othercharge = allPassenger?.OtherCharges;

            const servicefee = allPassenger?.ServiceFee;
            const totalTaxAmount = allPassenger?.Tax;
            const PaxtotalFare =
              basefare + totalTaxAmount + servicefee + othercharge;
            const PaxequivalentAmount = basefare;

            const baggageDetails = AllSegments.map((segment) => {
              let allowance = '';
              const allPaxBaggage = segment?.baggageDetails?.find(
                (baggage) => baggage?.IsAllPax === true,
              );
              if (allPaxBaggage) {
                allowance = allPaxBaggage?.Checkin || '';
              } else {
                allowance =
                  segment?.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType,
                    )
                    .map((baggage) => baggage?.Checkin)[0] || '';
              }

              return {
                Airline: ValidatingCarrier,
                Allowance: allowance || '',
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
              BaseFare: Math.ceil(PaxequivalentAmount),
              Taxes: totalTaxAmount,
              ServiceFee: servicefee,
              OtherCharges: othercharge,
              TotalFare: Math.ceil(PaxtotalFare),
              PaxCount: paxCount,
              Bag: baggageDetails,
              FareComponent: FareBasis,
            };
          });

          const processSegments = (segmentsList) => {
            if (segmentsList.length === 0) return null;

            const firstSegment = segmentsList[0];
            const lastSegment = segmentsList[segmentsList.length - 1];

            //trying to calculate the transittime
            let arivalTime = new Date(
              firstSegment.Destination.ArrTime,
            ).getTime();
            let deptureTime = new Date(lastSegment.Origin.DepTime).getTime();
            const totalduration = deptureTime - arivalTime;
            let totalDurationInMinutes = Math.floor(
              totalduration / (1000 * 60),
            );
            if (totalDurationInMinutes < 0) {
              totalDurationInMinutes = 0; // or handle it differently as per your logic
            }

            const legInfo = {
              DepDate: firstSegment?.Origin?.DepTime,
              DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
              ArrTo: lastSegment.Destination?.Airport?.AirportCode,

              //trying to calculate the transittime
              test: totalDurationInMinutes,

              Duration: segmentsList?.reduce(
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
              MarketingFlightNumber: segment?.Airline?.FlightNumber,
              OperatingCarrier: segment?.Airline?.OperatingCarrier,
              OperatingFlightNumber: segment?.Airline?.FlightNumber,
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
            (acc[segment?.SegmentGroup] =
              acc[segment?.SegmentGroup] || []).push(segment);
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
            PassportMadatory: Result?.PassportMadatory,
            InstantPayment: Instant_Payment,
            IsBookable: IsBookable,
            TripType: TripType,
            FareType: FareType,
            Carrier: ValidatingCarrier,
            CarrierName: CarrierName,
            Cabinclass: Cabinclass,
            BaseFare: Math.ceil(equivalentAmount1),
            Taxes: Taxes,
            SerViceFee: extraService + servicefee || 0,
            NetFare: Math.ceil(TotalFare), //change this before deploy
            GrossFare: Math.ceil(NetFare),
            PartialOption: partialoption,
            PartialFare: Math.ceil(PartialAmount),
            TimeLimit: TimeLimit,
            RePriceStatus: SearchResponse?.RePriceStatus,
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
  async airRetriveDataTransformer(
    SearchResponse: any,
    fisId: string,
    bookingStatus?: any,
    header?:any
  ): Promise<any> {
    const FlightItenary = [];
    const { Results } = SearchResponse;
    const PaxTypeMapping = {
      Adult: 1,
      Child: 2,
      Infant: 3,
    };

    if (Results) {
      const DepCountry =
        Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
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
        const Instant_Payment: boolean =
          Result?.FareType === 'InstantTicketing';
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
            const othercharge = allPassenger?.OtherCharges;

            const servicefee = allPassenger?.ServiceFee;
            const totalTaxAmount = allPassenger?.Tax;
            const PaxtotalFare =
              basefare + totalTaxAmount + servicefee + othercharge;
            const PaxequivalentAmount = basefare;

            const baggageDetails = AllSegments.map((segment) => {
              let allowance = '';
              const allPaxBaggage = segment?.baggageDetails?.find(
                (baggage) => baggage?.IsAllPax === true,
              );
              if (allPaxBaggage) {
                allowance = allPaxBaggage?.Checkin || '';
              } else {
                allowance =
                  segment?.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType,
                    )
                    .map((baggage) => baggage?.Checkin)[0] || '';
              }

              return {
                Airline: ValidatingCarrier,
                Allowance: allowance || '',
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
              BaseFare: Math.ceil(PaxequivalentAmount),
              Taxes: totalTaxAmount,
              ServiceFee: servicefee,
              OtherCharges: othercharge,
              TotalFare: Math.ceil(PaxtotalFare),
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
            (acc[segment?.SegmentGroup] =
              acc[segment?.SegmentGroup] || []).push(segment);
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
          let BookingStatus: string;
          if (bookingStatus) {
            BookingStatus = bookingStatus;
          } else {
            BookingStatus = SearchResponse?.BookingStatus;
          }

          FlightItenary.push({
            System: 'FLYHUB',
            ResultId: Result.ResultID,
            BookingId: fisId,
            PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
            SearchId: SearchResponse?.SearchId,
            BookingStatus: BookingStatus,
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
            PassengerList: SearchResponse?.Passengers,
          });
        }
      }
    }

    const sslpaymentLink =
      await this.paymentService.dataModification(FlightItenary,header);
    return {
      bookingData: FlightItenary,
      sslpaymentLink,
    };
  }

  async bookingDataTransformerFlyhb(
    SearchResponse: any,
    header?: any,
    currentTimestamp?: Date,
  ): Promise<any> {
    const FlightItenary = [];
    const { Results } = SearchResponse;
    const PaxTypeMapping = {
      Adult: 1,
      Child: 2,
      Infant: 3,
    };

    if (Results) {
      const DepCountry =
        Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
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
        const Instant_Payment: boolean =
          Result?.FareType === 'InstantTicketing';
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
            const othercharge = allPassenger?.OtherCharges;

            const servicefee = allPassenger?.ServiceFee;
            const totalTaxAmount = allPassenger?.Tax;
            const PaxtotalFare =
              basefare + totalTaxAmount + servicefee + othercharge;
            const PaxequivalentAmount = basefare;

            const baggageDetails = AllSegments.map((segment) => {
              let allowance = '';
              const allPaxBaggage = segment?.baggageDetails?.find(
                (baggage) => baggage?.IsAllPax === true,
              );
              if (allPaxBaggage) {
                allowance = allPaxBaggage?.Checkin || '';
              } else {
                allowance =
                  segment?.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType,
                    )
                    .map((baggage) => baggage?.Checkin)[0] || '';
              }

              return {
                Airline: ValidatingCarrier,
                Allowance: allowance || '',
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
              BaseFare: Math.ceil(PaxequivalentAmount),
              Taxes: totalTaxAmount,
              ServiceFee: servicefee,
              OtherCharges: othercharge,
              TotalFare: Math.ceil(PaxtotalFare),
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
            (acc[segment?.SegmentGroup] =
              acc[segment?.SegmentGroup] || []).push(segment);
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

          const randomId =
            'FIS' +
            Math.floor(Math.random() * 10 ** 13)
              .toString()
              .padStart(13, '0');
          let add: BookingIdSave = new BookingIdSave();
          add.flyitSearchId = randomId;
          add.flyhubId = SearchResponse?.BookingID;
          await this.bookingIdSave.save(add);

          FlightItenary.push({
            System: 'FLYHUB',
            ResultId: Result.ResultID,
            BookingId: randomId,
            PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
            BookingDate: currentTimestamp || null,
            SearchId: SearchResponse?.SearchId,
            BookingStatus: SearchResponse?.BookingStatus,
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
            PassengerList: SearchResponse?.Passengers,
          });
        }
      }
    }

    await this.saveBookingData(FlightItenary, header);
    return {
      bookingData: FlightItenary,
      sslpaymentLink: await this.paymentService.dataModification(FlightItenary,header),
    };
  }

  async saveBookingData(
    SearchResponse: any,
    header?: any,
    bookingId?: string,
  ): Promise<any> {
    const booking = SearchResponse[0];
    if (booking) {
      const flightNumber =
        booking.AllLegsInfo[0].Segments[0].MarketingFlightNumber;
      let tripType: string;
      if (booking.AllLegsInfo.length === 1) {
        tripType = 'OneWay';
      } else if (booking.AllLegsInfo.length === 2) {
        if (
          booking.AllLegsInfo[0].ArrTo === booking.AllLegsInfo[1].DepFrom &&
          booking.AllLegsInfo[0].DepFrom === booking.AllLegsInfo[1].ArrTo
        ) {
          tripType = 'Return';
        } else {
          tripType = 'Multicity';
        }
      } else {
        tripType = 'Multicity';
      }
      const paxCount = booking.PriceBreakDown.reduce(
        (sum: number, breakdown: any) => sum + breakdown.PaxCount,
        0,
      );

      const convertedData = {
        system: booking?.System,
        bookingId: bookingId ?? booking?.BookingId,
        paxCount: paxCount,
        Curriername: booking?.CarrierName,
        CurrierCode: booking?.Carrier,
        flightNumber: flightNumber.toString(),
        isRefundable: booking?.Refundable,
        bookingDate: booking?.BookingDate,
        expireDate: booking?.TimeLimit,
        bookingStatus: booking?.BookingStatus,
        PNR: booking?.PNR,
        grossAmmount: booking?.GrossFare,
        netAmmount: booking?.NetFare,
        TripType: tripType,

        laginfo: booking?.AllLegsInfo.map((leg: any) => ({
          DepDate: leg?.DepDate,
          DepFrom: leg?.DepFrom,
          ArrTo: leg?.ArrTo,
        })),
      };

      await this.mailService.sendMail(booking);
      return await this.BookService.saveBooking(convertedData, header);
    } else {
      return 'Booking data is unvalid';
    }
  }

  async bookingCancelDataTranformerFlyhub(
    SearchResponse: any,
    fisId: string,
    header?: any,
  ): Promise<any> {
    const FlightItenary = [];
    const { Results } = SearchResponse;
    const PaxTypeMapping = {
      Adult: 1,
      Child: 2,
      Infant: 3,
    };

    if (Results) {
      const DepCountry =
        Results?.[0]?.segments[0]?.Origin?.Airport?.CountryName;
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
        const Instant_Payment: boolean =
          Result?.FareType === 'InstantTicketing';
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
            const othercharge = allPassenger?.OtherCharges;

            const servicefee = allPassenger?.ServiceFee;
            const totalTaxAmount = allPassenger?.Tax;
            const PaxtotalFare =
              basefare + totalTaxAmount + servicefee + othercharge;
            const PaxequivalentAmount = basefare;

            const baggageDetails = AllSegments.map((segment) => {
              let allowance = '';
              const allPaxBaggage = segment?.baggageDetails?.find(
                (baggage) => baggage?.IsAllPax === true,
              );
              if (allPaxBaggage) {
                allowance = allPaxBaggage?.Checkin || '';
              } else {
                allowance =
                  segment?.baggageDetails
                    ?.filter(
                      (baggage) => PaxTypeMapping[PaxType] === baggage?.PaxType,
                    )
                    .map((baggage) => baggage?.Checkin)[0] || '';
              }

              return {
                Airline: ValidatingCarrier,
                Allowance: allowance || '',
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
              BaseFare: Math.ceil(PaxequivalentAmount),
              Taxes: totalTaxAmount,
              ServiceFee: servicefee,
              OtherCharges: othercharge,
              TotalFare: Math.ceil(PaxtotalFare),
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
            (acc[segment?.SegmentGroup] =
              acc[segment?.SegmentGroup] || []).push(segment);
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
            BookingId: fisId,
            PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
            SearchId: SearchResponse?.SearchId,
            BookingStatus: SearchResponse?.BookingStatus,
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
            PassengerList: SearchResponse?.Passengers,
          });
        }
      }
    }
    await this.BookService.cancelDataSave(
      FlightItenary[0].BookingId,
      FlightItenary[0].BookingStatus,
      header,
    );

    return FlightItenary;
  }
}
