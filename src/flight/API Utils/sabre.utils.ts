import { Injectable } from '@nestjs/common';
import { Agents } from 'src/agents/entities/agents.entity';
import { AirportsService } from 'src/airports/airports.service';
import { parseString } from 'xml2js';
import { v4 as uuidv4 } from 'uuid';

import { AirlinesService } from 'src/airlines/airlines.service';
import { airportsData } from '../data/airportsData';
import { airlinesData } from '../data/airlinesData';

@Injectable()
export class SabreUtils {
  constructor(
    private readonly airlinesService: AirlinesService,
    private readonly airportsService: AirportsService,
  ) {}

  async tokenParser(data: any): Promise<any> {
    const xmlTokenData = await this.xmlParser(data);
    const securitytoken =
      xmlTokenData?.Envelope?.Header?.[0]['wsse:Security'][0][
        'wsse:BinarySecurityToken'
      ][0]['_'];
    return securitytoken;
  }
  async xmlParser(data: any) {
    let convertedData: any;
    parseString(data, function (err, results) {
      const removeSoap = JSON.stringify(results)?.replaceAll('soap-env:', '');
      const replace = removeSoap?.replaceAll('$', 'data');
      convertedData = JSON.parse(replace);
    });

    return convertedData;
  }
  async restBFMParser(agentdata: Agents, SearchResponse: any) {
    if (
      SearchResponse?.groupedItineraryResponse?.statistics?.itineraryCount > 0
    ) {
      const DepPlace =
        SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
          .groupDescription?.legDescriptions[0]?.departureLocation;
      const ArrPlace =
        SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
          .groupDescription?.legDescriptions[0]?.arrivalLocation;

      const DepCounty = await this.airportsService.getCountry(DepPlace);
      const ArrCounty = await this.airportsService.getCountry(ArrPlace);

      let farepolicy: string;
      let partialoption: boolean;
      if (DepCounty === 'BD' && ArrCounty === 'BD') {
        farepolicy = 'domestic';
        partialoption = false;
      } else if (DepCounty != 'BD' && ArrCounty != 'BD') {
        farepolicy = 'soto';
        partialoption = false;
      } else if (DepCounty != 'BD' && ArrCounty === 'BD') {
        farepolicy = 'soti';
        partialoption = true;
      } else if (DepCounty === 'BD' && ArrCounty != 'BD') {
        farepolicy = 'sito';
        partialoption = true;
      }

      const FlightItenary = [];
      if (
        SearchResponse?.groupedItineraryResponse?.itineraryGroups?.[0]
          ?.itineraries
      ) {
        const AllFlights: any[] =
          SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
            .itineraries;
        const AllBaggage: any[] =
          SearchResponse?.groupedItineraryResponse?.baggageAllowanceDescs;
        const AllLegDescs: any[] =
          SearchResponse?.groupedItineraryResponse?.legDescs;
        const AllscheduleDescs: any[] =
          SearchResponse?.groupedItineraryResponse?.scheduleDescs;
        const AllFareCompoDescs: any[] =
          SearchResponse?.groupedItineraryResponse?.fareComponentDescs;
        const GroupLegDescs: any[] =
          SearchResponse?.groupedItineraryResponse?.itineraryGroups[0]
            ?.groupDescription?.legDescriptions;

        let TripType: string;
        if (GroupLegDescs.length === 1) {
          TripType = 'Oneway';
        } else if (
          GroupLegDescs.length > 1 &&
          GroupLegDescs[0]?.departureLocation ===
            GroupLegDescs[1]?.arrivalLocation
        ) {
          TripType = 'Return';
        } else if (
          GroupLegDescs.length > 1 &&
          GroupLegDescs[0]?.departureLocation !==
            GroupLegDescs[1]?.arrivalLocation
        ) {
          TripType = 'Multicity';
        }

        for (const flights of AllFlights) {
          const ValidatingCarrier: string =
            flights['pricingInformation'][0]['fare']['validatingCarrierCode'];
          const airlineData: any =
            await this.airlinesService.getAirlines(ValidatingCarrier);
          const FareType: string = 'Regular';
          const AllPassenger: any[] =
            flights['pricingInformation'][0]['fare']['passengerInfoList'];
          const CarrierName: string = airlineData?.marketing_name || 'N/F';
          const Instant_Payment: boolean = airlineData?.instantPayment;
          const IssuePermit: boolean = airlineData?.issuePermit;
          const IsBookable: boolean = airlineData?.bookable;
          const equivalentAmount: number =
            flights['pricingInformation'][0]['fare']['totalFare'][
              'equivalentAmount'
            ];
          const Taxes: number =
            flights['pricingInformation'][0]['fare']['totalFare'][
              'totalTaxAmount'
            ];
          let TotalFare: number =
            flights['pricingInformation'][0]['fare']['totalFare']['totalPrice'];

          const adminMarkUpType: string = agentdata?.markuptype;
          const adminMarkUp: number = agentdata?.markup;

          let adminMarkUpAmount: number = 0;
          if (adminMarkUpType === 'percent') {
            adminMarkUpAmount = equivalentAmount * (adminMarkUp / 100);
          } else if (adminMarkUpType === 'amount') {
            adminMarkUpAmount = adminMarkUp;
          }

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

          const airlinesMarkUpAmount =
            equivalentAmount * (ComissionPolicy / 100);
          const agentMarkUpType: string = agentdata?.clientmarkuptype;
          const agentMarkUp: number = agentdata?.clientmarkup;

          let agentMarkUpAmount: number = 0;
          if (agentMarkUpType === 'percent') {
            agentMarkUpAmount = equivalentAmount * (agentMarkUp / 100);
          } else if (agentMarkUpType === 'amount') {
            agentMarkUpAmount = agentMarkUp;
          }

          const NetFare =
            equivalentAmount +
            adminMarkUpAmount +
            airlinesMarkUpAmount +
            addAmount +
            agentMarkUpAmount +
            Taxes;

          if (NetFare > TotalFare) {
            TotalFare = NetFare;
          }

          const PartialAmount: number = NetFare * 0.3;

          const Refundable: boolean =
            !flights.pricingInformation?.[0].fare.passengerInfoList?.[0]
              .passengerInfo.nonRefundable;
          let TimeLimit: string;
          if (flights?.pricingInformation?.[0]?.fare?.lastTicketDate) {
            const lastTicketDate: string =
              flights.pricingInformation?.[0]?.fare?.lastTicketDate;
            const lastTicketTime: string =
              flights.pricingInformation?.[0]?.fare?.lastTicketTime;
            TimeLimit = `${lastTicketDate}T${lastTicketTime}:00`;
          }

          let cabinclass: string =
            AllPassenger[0]?.passengerInfo?.fareComponents[0]?.segments[0]
              ?.segment?.cabinCode || 'Y';
          let Class: string;
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

          const PriceBreakDown: any[] = AllPassenger?.map((allPassenger) => {
            const PaxType = allPassenger?.passengerInfo?.passengerType;
            const paxCount = allPassenger?.passengerInfo?.passengerNumber;
            const PaxtotalFare =
              allPassenger?.passengerInfo?.passengerTotalFare?.totalFare;
            const totalTaxAmount =
              allPassenger?.passengerInfo?.passengerTotalFare?.totalTaxAmount;
            const PaxequivalentAmount =
              allPassenger?.passengerInfo?.passengerTotalFare?.equivalentAmount;

            const BaggageAllowance =
              allPassenger?.passengerInfo?.baggageInformation;
            const Baggage = BaggageAllowance?.map((baggageAllowance) => {
              const BagAirlineCode = baggageAllowance?.airlineCode;
              const AllowanceRef =
                AllBaggage[baggageAllowance?.allowance?.ref - 1];

              let Allowance: string;
              if (AllowanceRef?.pieceCount) {
                Allowance = AllowanceRef?.pieceCount + ' Piece';
              } else {
                Allowance = AllowanceRef?.weight + ' KG';
              }

              return {
                Airline: BagAirlineCode,
                Allowance: Allowance,
              };
            });

            let i = 0;
            const FareBasis = allPassenger?.passengerInfo?.fareComponents?.map(
              (fareComponent) => {
                i++;
                const farecompoRef = fareComponent?.ref;
                const fareCompo = AllFareCompoDescs[farecompoRef - 1];
                return {
                  Origin: fareComponent?.beginAirport,
                  Destination: fareComponent?.endAirport,
                  DepDate:
                    GroupLegDescs[i - 1]?.departureDate ||
                    GroupLegDescs[0]?.departureDate,
                  FareBasisCode: fareCompo.fareBasisCode,
                  Carrier: fareCompo.governingCarrier,
                };
              },
            );

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
          const AllLegsData =
            flights?.pricingInformation?.[0]?.fare?.passengerInfoList[0]
              ?.passengerInfo?.fareComponents;
          const LegDescRef = flights?.legs;

          for (
            let i = 0;
            i < Math.min(AllLegsData.length, LegDescRef.length);
            i++
          ) {
            const SingleLegs: number = LegDescRef[i].ref - 1;
            const legDesc: any = AllLegDescs[SingleLegs];
            const LegDuration: string = legDesc?.elapsedTime;

            const AllLegs: any[] = GroupLegDescs || [];
            const departureDate: string = AllLegs[i].departureDate;

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
                  departureDateTime.setDate(
                    departureDateTime.getDate() + AdjustDepDate,
                  );
                  AdjustedDepDate = new Date(departureDateTime)
                    .toISOString()
                    .split('T')[0];
                }

                let AdjustedArrDate = AdjustedDepDate;
                let AdjustArrDate = 0;
                if (Schedules?.arrival?.dateAdjustment) {
                  AdjustArrDate = Schedules?.arrival?.dateAdjustment;
                  const arrivalDateTime = new Date(AdjustedDepDate);
                  arrivalDateTime.setDate(
                    arrivalDateTime.getDate() + AdjustArrDate,
                  );
                  AdjustedArrDate = new Date(AdjustedDepDate)
                    .toISOString()
                    .split('T')[0];
                }

                const OperatedBy =
                  Schedules?.arrival?.disclosure ||
                  Schedules?.carrier?.operating;

                const SingleSegments = {
                  MarketingCarrier: Schedules?.carrier?.marketing,
                  MarketingCarrierName: await this.getAirlineName(
                    Schedules.carrier.marketing,
                  ),
                  MarketingFlightNumber:
                    Schedules?.carrier?.marketingFlightNumber,
                  OperatingCarrier: Schedules?.carrier?.operating,
                  OperatingFlightNumber:
                    Schedules?.carrier?.operatingFlightNumber,
                  OperatingCarrierName: await this.getAirlineName(
                    Schedules.carrier.operating,
                  ),
                  DepFrom: Schedules?.departure?.airport,
                  DepAirPort: (
                    await this.getAirports(Schedules.departure.airport)
                  )?.name,
                  DepLocation: (
                    await this.getAirports(Schedules.departure.airport)
                  )?.location,
                  DepDateAdjustment: AdjustDepDate,
                  DepTime: `${AdjustedDepDate}T${Schedules.departure.time}`,
                  ArrTo: Schedules?.arrival?.airport,
                  ArrAirPort: (
                    await this.getAirports(Schedules.arrival.airport)
                  ).name,
                  ArrLocation: (
                    await this.getAirports(Schedules.arrival.airport)
                  ).location,
                  ArrDateAdjustment: AdjustArrDate,
                  ArrTime: `${AdjustedArrDate}T${Schedules.arrival.time}`,
                  OperatedBy:
                    await this.airlinesService.getAirlinesName(OperatedBy),
                  StopCount: Schedules?.stopCount,
                  Duration: Schedules?.elapsedTime,
                  AircraftTypeName:
                    Schedules?.carrier?.equipment?.code || 'N/A',
                  DepartureGate: Schedules?.departure?.terminal || 'TBA',
                  ArrivalGate: Schedules?.arrival?.terminal || 'TBA',
                  HiddenStops: Schedules?.hiddenStops || [],
                  TotalMilesFlown: Schedules?.totalMilesFlown || 0,
                  SegmentCode: allSegments[index].segment,
                };

                segments.push(SingleSegments);
              } catch (error) {
                console.error(error.message);
              }
            }

            legInfo['Segments'] = segments;
            AllLegsInfo.push(legInfo);
          }

          FlightItenary.push({
            ResultId: '',
            OfferId: uuidv4(),
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
    } else {
      return [];
    }
  }
  async getAirports(code: string) {
    const foundItem = airportsData.find((item) => item.code === code);
    if (foundItem) {
      return foundItem;
    } else {
      return { code: '', name: '', location };
    }
  }

  async getAirlineName(code: string) {
    const foundItem = airlinesData.find((item) => item.code === code);
    if (foundItem) {
      return foundItem.name;
    } else {
      return 'N/F';
    }
  }
  async fareRulesParser(data: any): Promise<{}> {
    const farerules = await this.xmlParser(data);
    const farerulesdata =
      farerules.Envelope?.Body[0]?.OTA_AirRulesRS[0]?.FareRuleInfo[0]?.Rules[0];
    const refundpolicy = farerulesdata.Paragraph[0].Text;
    const reissuepolicy = farerulesdata.Paragraph[1].Text;

    const finalresult = {
      refundpolicy: refundpolicy,
      reissuepolicy: reissuepolicy,
    };

    return finalresult;
  }
  async seatMapParser(data: any): Promise<void> {
    const seatmap = await this.xmlParser(data);
    const seatdata =
      seatmap?.Envelope?.Body[0]?.EnhancedSeatMapRS[0]?.SeatMap[0];
    return seatdata;
  }
}
