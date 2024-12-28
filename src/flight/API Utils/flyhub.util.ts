import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingService } from 'src/book/booking.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentService } from 'src/payment/payment.service';
import { BookingIdSave } from '../flight.model';
import { Repository } from 'typeorm';
import { Wallet } from 'src/deposit/deposit.model';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';

@Injectable()
export class FlyHubUtil {
  constructor(
    private readonly BookService: BookingService,
    private readonly mailService: MailService,
    private readonly paymentService: PaymentService,
    private readonly authService: AuthService,
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave: Repository<BookingIdSave>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(BookingSave)
    private readonly bookingSave: Repository<BookingSave>,
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
            const legInfo = {
              DepDate: firstSegment?.Origin?.DepTime,
              DepFrom: firstSegment?.Origin?.Airport?.AirportCode,
              ArrTo: lastSegment.Destination?.Airport?.AirportCode,

              Duration: segmentsList?.reduce(
                (acc, segment) => acc + parseInt(segment?.JourneyDuration),
                0,
              ),
            };
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
                bookingCode: segment?.Airline?.BookingClass,
                cabinCode: segment?.Airline?.CabinClass,
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
          if(FareType!=="InstantTicketing"){

          FlightItenary.push({
            System: 'API1',
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
    }

    return FlightItenary;
  }
  async airRetriveDataTransformer(
    SearchResponse: any,
    fisId: string,
    bookingStatus?: any,
    tripType?: any,
    bookingDate?: any,
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
          if (bookingStatus == 'IssueInProcess') {
            if (Result?.LastTicketDate) {
              const lastTicketDate: string = Result?.LastTicketDate;
              TimeLimit = `${lastTicketDate}`;
            }
          } else {
            const timestamp = new Date(bookingDate);
            const lastTicketDate: any = new Date(
              timestamp.getTime() + 20 * 60 * 1000,
            ).toISOString();
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
                bookingCode: segment?.Airline?.BookingClass,
                cabinCode: segment?.Airline?.CabinClass,
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
          const passportRequired =
            !!SearchResponse?.Passengers[0]?.PassportNumber;
          FlightItenary.push({
            System: 'API1',
            ResultId: Result.ResultID,
            BookingId: fisId,
            PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
            TripType: tripType,
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
            NetFare: Math.ceil(TotalFare),
            GrossFare: NetFare,
            PartialOption: partialoption,
            PartialFare: Math.ceil(PartialAmount),
            TimeLimit: TimeLimit,
            BookingDate: bookingDate,
            Refundable: Refundable,
            ExtraService: Result?.ExtraServices || null,
            PriceBreakDown: PriceBreakDown,
            AllLegsInfo: AllLegsInfo,
            PassengerList: SearchResponse?.Passengers,
            PassportRequired: passportRequired,
          });
        }
      }
    }

    // const sslpaymentLink = await this.paymentService
    //   .dataModification(FlightItenary, header)
    //   .catch(() => null);
    //const surjopay = await this.paymentService.formdata(FlightItenary, header);
    const bkash = await this.paymentService.bkashInit(FlightItenary, header);

    // const price = FlightItenary?.[0]?.NetFare || 0;

    // const email = await this.authService.decodeToken(header).catch(() => 'NA');

    // let wallet = await this.walletRepository
    //   .createQueryBuilder('wallet')
    //   .innerJoinAndSelect('wallet.user', 'user')
    //   .where('user.email = :email', { email })
    //   .getOne()
    //   .catch(() => null);

    // const walletAmmount = wallet?.ammount || 0;

    // let priceAfterPayment: number = walletAmmount - price;

    // if (priceAfterPayment < 0) {
    //   priceAfterPayment = 0;
    // }
    return {
      bookingData: FlightItenary,
      // sslpaymentLink: sslpaymentLink,
      //surjopay: surjopay,
      bkash: bkash,
      // walletPayment: { walletAmmount, price, priceAfterPayment },
    };
  }

  async bookingDataTransformerFlyhb(
    SearchResponse: any,
    header: any,
    currentTimestamp: any,
    personIds: any,
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

          const timestamp = new Date(currentTimestamp);
          const lastTicketDate: any = new Date(
            timestamp.getTime() + 20 * 60 * 1000,
          )
            .toISOString()
          TimeLimit = `${lastTicketDate}`; // changes done

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
                bookingCode: segment?.Airline?.BookingClass,
                cabinCode: segment?.Airline?.CabinClass,
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
            System: 'API1',
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
            GrossFare: Math.ceil(NetFare),
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
    await this.saveBookingData(FlightItenary, header, personIds);
    // const sslpaymentLink = await this.paymentService
    //   .dataModification(FlightItenary, header)
    //   .catch(() => null);
    //const surjopay = await this.paymentService.formdata(FlightItenary, header);
    const bkash = await this.paymentService.bkashInit(FlightItenary, header);

    // const price = FlightItenary?.[0]?.NetFare || 0;

    // const email = await this.authService.decodeToken(header).catch(() => 'NA');

    // let wallet = await this.walletRepository
    //   .createQueryBuilder('wallet')
    //   .innerJoinAndSelect('wallet.user', 'user')
    //   .where('user.email = :email', { email })
    //   .getOne()
    //   .catch(() => null);

    // const walletAmmount = wallet?.ammount || 0;

    // let priceAfterPayment: number = walletAmmount - price;

    // if (priceAfterPayment < 0) {
    //   priceAfterPayment = 0;
    // }
    return {
      bookingData: FlightItenary,
      //sslpaymentLink: sslpaymentLink,
      //surjopay: surjopay,
      bkash: bkash,
      //walletPayment: { walletAmmount, price, priceAfterPayment },
    };
  }

  async saveBookingData(
    SearchResponse: any,
    header: any,
    personIds: any,
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
          booking.AllLegsInfo[0].DepFrom === booking.AllLegsInfo[1].ArrTo 
        )
         {
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
        bookingId: booking?.BookingId,
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
        personId: personIds,
        bookingData: SearchResponse,
        laginfo: booking?.AllLegsInfo.map((leg: any) => ({
          DepDate: leg?.DepDate,
          DepFrom: leg?.DepFrom,
          ArrTo: leg?.ArrTo,
        })),
      };
      //return convertedData
      const save = await this.BookService.saveBooking(convertedData, header);

      //await this.mailService.sendMail(booking);

      return save;
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
            System: 'API1',
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
    await this.mailService.sendMail(FlightItenary[0]);
    return FlightItenary;
  }

  async airRetriveDataTransformerAdmin(
    SearchResponse: any,
    fisId: string,
    bookingStatus?: any,
    tripType?: any,
    bookingDate?: any,
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
        let discount: number = Result?.Discount;
        const bookingData = await this.bookingSave.findOne({
          where: { bookingId: fisId },
        });

        const equivalentAmount: number = AllPassenger.reduce(
          (sum, passenger) =>
            sum + (passenger?.BaseFare * passenger?.PassengerCount || 0),
          0,
        );
        let equivalentAmount1: number = equivalentAmount;

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

        let TotalFare: number = Result?.TotalFare || 0;

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
            const basefare = allPassenger?.BaseFare;
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
                bookingCode: segment?.Airline?.BookingClass,
                cabinCode: segment?.Airline?.CabinClass,
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
          const passportRequired =
            !!SearchResponse?.Passengers[0]?.PassportNumber;
          FlightItenary.push({
            System: 'API1',
            ResultId: Result.ResultID,
            BookingId: fisId,
            PNR: SearchResponse?.Results[0]?.segments[0]?.AirlinePNR,
            TripType: tripType,
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
            FlyHubFareNetFare: Math.ceil(TotalFare), //change this before deploy
            GrossFare: NetFare,
            CustomerInvoice: Number(bookingData.netAmmount),
            Discount: discount,
            Profit: Number(bookingData.netAmmount) - Math.ceil(TotalFare),
            PartialOption: partialoption,
            PartialFare: Math.ceil(PartialAmount),
            TimeLimit: TimeLimit,
            BookingDate: bookingDate,
            Refundable: Refundable,
            ExtraService: Result?.ExtraServices || null,
            PriceBreakDown: PriceBreakDown,
            AllLegsInfo: AllLegsInfo,
            PassengerList: SearchResponse?.Passengers,
            PassportRequired: passportRequired,
          });
        }
      }
    }

    return FlightItenary;
  }
}
