import { Injectable } from '@nestjs/common';
import { AirportsService } from 'src/airports/airports.service';

@Injectable()
export class BfFareUtil {
  constructor(private readonly airportService:AirportsService){}
  async afterSerarchDataModifierBdFare(
    SearchResponse: any,
    journeyType?: string,
  ): Promise<any[]> {
    const FlightItenary = [];
    const { offersGroup } = SearchResponse;

    if (offersGroup) {
      for (const offerData of offersGroup) {
        const offer = offerData?.offer;
        const offerID = [];
        if (Array.isArray(offer?.upSellBrandList)) {
          offerID.push(
            ...offer.upSellBrandList.map((item) => item.upSellBrand?.offerId),
          );
        } else {
          offerID.push(offer.offerId);
        }
       
        const validatingCarrier = offer?.validatingCarrier || 'N/A';
        const fareType = offer?.fareType || 'Regular';
        const IsBookable = offer?.fareType === 'OnHold';
        const instantPayment = offer?.fareType !== 'OnHold';
        const isRefundable = offer?.refundable || false;
        const paxSegments = offer?.paxSegmentList || [];
        const fareDetails = offer?.fareDetailList || [];
        const totalFare = offer?.price?.totalPayable?.total || 0;
        const currency = offer?.price?.totalPayable?.curreny || 'BDT';
        const baggageAllowances = offer?.baggageAllowanceList || [];
        const seatsRemaining = offer?.seatsRemaining || 'N/A';
        const carrierName = offer.paxSegmentList[0].paxSegment.marketingCarrierInfo.carrierName
        const netFare = offer?.price?.gross?.total || 0;
        let tripType = 'Unknown';
        if (journeyType === '1') {
          tripType = 'Oneway';
        } else if (journeyType === '2') {
          tripType = 'Return';
        } else if (journeyType === '3') {
          tripType = 'Multicity';
        }

        const totalBaseFare = fareDetails.reduce(
          (sum, item) => sum + item.fareDetail.baseFare,
          0,
        );
        const tax = fareDetails.reduce(
          (sum, item) => sum + item.fareDetail.tax,
          0,
        );
        const vat = fareDetails.reduce(
          (sum, item) => sum + item.fareDetail.vat,
          0,
        );
        const others = fareDetails.reduce(
          (sum, item) => sum + item.fareDetail.otherFee,
          0,
        );
        const service = vat + others;
        const PriceBreakDown = fareDetails.map((fareDetailData) => {
          const fareDetail = fareDetailData.fareDetail;
          return {
            PaxType: fareDetail?.paxType || 'Unknown',
            BaseFare: fareDetail?.baseFare || 0,
            Taxes: fareDetail?.tax || 0,
            OtherCharges: fareDetail?.otherFee || 0,
            Discount: fareDetail?.discount || 0,
            ServiceFee: fareDetail?.vat || 0,
            TotalFare: fareDetail?.subTotal || 0,
            PaxCount: fareDetail?.paxCount || 1,
          };
        });

        const groupedSegments = paxSegments.reduce((acc, segmentData) => {
          const segment = segmentData.paxSegment;
          (acc[segment?.segmentGroup] = acc[segment?.segmentGroup] || []).push(
            segment,
          );
          return acc;
        }, {});

        const baggageDetails = baggageAllowances.map((baggageAllowanceData) => {
          const allowance = baggageAllowanceData.baggageAllowance;
          return {
            Checkin: allowance?.checkIn,
            Cabin: allowance?.cabin,
          };
        });

        const mergedData = PriceBreakDown.map((pax) => {
          const bags = baggageDetails.flatMap((detail) => {
            const checkinBag = detail.Checkin.find(
              (bag) => bag.paxType === pax.PaxType,
            );
            const cabinBag = detail.Cabin.find(
              (bag) => bag.paxType === pax.PaxType,
            );
            return checkinBag && cabinBag
              ? [
                  {
                    Allowance: checkinBag.allowance,
                    AllowanceCabin: cabinBag.allowance,
                  },
                ]
              : [];
          });

          const farecomponent = paxSegments.flatMap((segment) => {
            const origin = segment.paxSegment.departure.iatA_LocationCode;
            const destination = segment.paxSegment.arrival.iatA_LocationCode;
            const depdate =
              segment.paxSegment.departure.aircraftScheduledDateTime;
            const carrier =
              segment.paxSegment.marketingCarrierInfo.carrierDesigCode;
            const rbd = segment.paxSegment.rbd;
            return [
              {
                Origin: origin,
                Destination: destination,
                DepDate: depdate.replace('Z', ''),
                RBD: rbd,
                Carrier: carrier,
              },
            ];
          });
          return { ...pax, Bag: bags, FareComponent: farecomponent };
        });

        const AllLegsInfo = [];
        for (const key in groupedSegments) {
          const groupSegments = groupedSegments[key];
          if (!groupSegments) continue;

          const firstSegment = groupSegments[0];
          const lastSegment = groupSegments[groupSegments.length - 1];
          // const departureLocations = await Promise.all(
          //   groupSegments.map(async (segment) => {
          //     const airportName = await this.airportService.airportName(
          //       segment?.departure?.iatA_LocationCode,
          //     );
          //     return airportName || 'Unknown Airport'; 
          //   }),
          // );

          // const arivalLocations = await Promise.all(
          //   groupSegments.map(async (segment) => {
          //     const airportName = await this.airportService.airportName(
          //       segment?.arrival?.iatA_LocationCode,
          //     );
          //     return airportName || 'Unknown Airport'; 
          //   }),
          // ); 
          const legInfo = {
            DepDate: firstSegment?.departure?.aircraftScheduledDateTime.replace(
              'Z',
              '',
            ),
            DepFrom: firstSegment?.departure?.iatA_LocationCode,
            ArrTo: lastSegment?.arrival?.iatA_LocationCode,
            Duration: groupSegments.reduce(
              (acc, segment) => acc + parseInt(segment?.duration || '0', 10),
              0,
            ),
            Segments: groupSegments.map((segment,index) => (
              
              {
              MarketingCarrier: segment?.marketingCarrierInfo?.carrierDesigCode,
              MarketingCarrierName: segment?.marketingCarrierInfo?.carrierName,
              MarketingFlightNumber:segment?.marketingCarrierInfo?.marketingCarrierFlightNumber,
              OperatingCarrierName:segment?.operatingCarrierInfo?.carrierName,
              OperatingCarrier: segment?.operatingCarrierInfo?.carrierDesigCode,
              OperatingFlightNumber: segment?.flightNumber,
              DepFrom: segment?.departure?.iatA_LocationCode,
              DepTime: segment?.departure?.aircraftScheduledDateTime.replace(
                'Z',
                '',
              ),
              
              // DepAirPort://departureLocations[index].name,
              // DepLocation://`${departureLocations[index].cityName},${departureLocations[index].countryName}`,
              ArrTo: segment?.arrival?.iatA_LocationCode,
              ArrTime: segment?.arrival?.aircraftScheduledDateTime.replace(
                'Z',
                '',
              ),
              // ArrAirPort: //arivalLocations[index].name,
              // ArrLocation://`${arivalLocations[index].cityName},${arivalLocations[index].countryName}`,
              CabinClass: segment?.cabinType,
              Duration: segment?.duration,
              AircraftTypeNameIatA: segment?.iatA_AircraftType?.iatA_AircraftTypeCode,
              AircraftType:segment?.marketingCarrierInfo?.marketingCarrierFlightNumber,
              DepartureGate: segment?.departure?.terminalName,
              ArrivalGate: segment?.arrival?.terminalName,
              OperatedBy: segment?.operatingCarrierInfo?.carrierDesigCode,
              HiddenStops:segment?.technicalStopOver || [],
              SegmentCode: {
                bookingCode: segment?.rbd,
                cabinCode: segment?.cabinType,
                seatsAvailable: offer.seatsRemaining,
              },
            })),
          };
          AllLegsInfo.push(legInfo);
        }

        FlightItenary.push({
          System: 'BDF',
          SearchId: SearchResponse.traceId,
           //traceId
          ResultId: offerID, //offerId
          PassportMadatory:SearchResponse.passportRequired,
          FareType: fareType,
          Refundable: isRefundable,
          TripType: tripType,
          InstantPayment: instantPayment,
          GrossFare: totalFare,
          IsBookable: IsBookable,
          Carrier: validatingCarrier,
          CarrierName: carrierName,
          BaseFare: totalBaseFare,
          Taxes: tax,
          SerViceFee: service,
          //TimeLimit:
          //ExtraService:
          NetFare: netFare,
          Currency: currency,
          //BaggageDetails: baggageDetails,
          SeatsRemaining: seatsRemaining,
          PriceBreakDown: mergedData,
          SSR:SearchResponse.availableSSR,
          AllLegsInfo: AllLegsInfo,
        });
      }
    }
return FlightItenary;


  }


}
