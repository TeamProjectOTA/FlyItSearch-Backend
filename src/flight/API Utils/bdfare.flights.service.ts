import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import axios, { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { FlightSearchModel } from '../flight.model';
import {
  DestArrivalRequestDto,
  OriginDepRequestDto,
  OriginDestDto,
  PaxDto,
  RequestDto,
  RequestInnerDto,
  ShoppingCriteriaDto,
  TravelPreferencesDto,
} from './Dto/bdfare.model';
import { BfFareUtil } from './bdfare.util';

@Injectable()
export class BDFareService {
  private readonly apiUrl: string = process.env.BDFareAPI_URL;
  private readonly apiKey: string = process.env.BDFareAPI_KEY;

  constructor(private readonly bdfareUtil: BfFareUtil) {}

  private transformToRequestDto(
    flightSearchModel: FlightSearchModel,
  ): RequestDto {
    const originDest = flightSearchModel.segments.map((segment) => {
      const originDepRequest = new OriginDepRequestDto();
      originDepRequest.iatA_LocationCode = segment.depfrom;
      originDepRequest.date = new Date(segment.depdate)
        .toISOString()
        .split('T')[0];

      const destArrivalRequest = new DestArrivalRequestDto();
      destArrivalRequest.iatA_LocationCode = segment.arrto;

      const originDestDto = new OriginDestDto();
      originDestDto.originDepRequest = originDepRequest;
      originDestDto.destArrivalRequest = destArrivalRequest;

      return originDestDto;
    });

    const pax: PaxDto[] = [];

    for (let i = 0; i < flightSearchModel.adultcount; i++) {
      const paxDto = new PaxDto();
      paxDto.paxID = `PAX${pax.length + 1}`;
      paxDto.ptc = 'ADT';
      pax.push(paxDto);
    }

    for (let i = 0; i < flightSearchModel.childcount; i++) {
      const paxDto = new PaxDto();
      paxDto.paxID = `PAX${pax.length + 1}`;
      paxDto.ptc = 'CHD';
      pax.push(paxDto);
    }

    for (let i = 0; i < flightSearchModel.infantcount; i++) {
      const paxDto = new PaxDto();
      paxDto.paxID = `PAX${pax.length + 1}`;
      paxDto.ptc = 'INF';
      pax.push(paxDto);
    }

    const travelPreferences = new TravelPreferencesDto();
    travelPreferences.cabinCode = this.mapCabinClass(
      flightSearchModel.cabinclass,
    );
    const shoppingCriteria = new ShoppingCriteriaDto();
    shoppingCriteria.tripType = this.determineJourneyType(
      flightSearchModel.segments,
    );
    shoppingCriteria.travelPreferences = travelPreferences;
    shoppingCriteria.returnUPSellInfo = false; // Assuming true for simplicity

    const requestInner = new RequestInnerDto();
    requestInner.originDest = originDest;
    requestInner.pax = pax;
    requestInner.shoppingCriteria = shoppingCriteria;

    const requestDto = new RequestDto();
    requestDto.pointOfSale = 'BD';
    requestDto.request = requestInner;

    return requestDto;
  }

  private mapCabinClass(cabinClass: string): string {
    switch (cabinClass) {
      case '1':
        return 'Economy';
      case '2':
        return 'PremiumEconomy';
      case '3':
        return 'Business';
      case '4':
        return 'First';
      default:
        return 'Economy';
    }
  }

  async airShopping(flightSearchModel: FlightSearchModel): Promise<any> {
    const requestDto = this.transformToRequestDto(flightSearchModel);
    const tripType = requestDto.request.shoppingCriteria.tripType;

    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/AirShopping`,
        requestDto,
        {
          headers: {
            'X-API-KEY': this.apiKey,
          },
        },
      );

      if (response.data.response != null) {
        //return response.data.response
        return await this.bdfareUtil.afterSerarchDataModifierBdFare(
          response.data.response,
          tripType,
        );
      }

      return response.data.error;
    } catch (error) {
      console.error('Error calling external API', error);
      throw new HttpException(
        'Error calling external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fareRules() {}
  async offerPrice() {}
  async miniRule() {}
  async flightBooking() {}
  async flightRetrieve() {}
  async flightBookingChange() {}
  async flightBookingCancel() {}
  // async processApi(bdfaredto: RequestDto): Promise<any> {
  //   try {
  //     const response: AxiosResponse = await firstValueFrom(
  //       this.httpService.post(`${this.apiUrl}/AirShopping`, bdfaredto, {
  //         headers: {
  //           'X-API-KEY': this.apiKey,
  //         },
  //       }),
  //     );

  //     return response.data;
  //   } catch (error) {
  //     console.error('Error calling external API', error);
  //     throw new HttpException(
  //       'Error calling external API',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // async airShopping1(flightDto: FlightSearchModel) {
  //   let adultCount = flightDto?.adultcount || 1;
  //   let childCount = flightDto?.childcount || 0;
  //   let infantcount = flightDto?.infantcount || 0;
  //   let cabinclass = flightDto.cabinclass;
  //   let segments = flightDto.segments;
  //   const BDFareRequestPax = [];
  //   if (adultCount > 0) {
  //     const PaxQuantity = {
  //       Code: 'ADT',
  //       Quantity: adultCount,
  //     };
  //     BDFareRequestPax.push(PaxQuantity);
  //   }
  //   if (childCount > 0) {
  //     const PaxQuantity = {
  //       Code: 'CNN',
  //       Quantity: childCount,
  //     };
  //     BDFareRequestPax.push(PaxQuantity);
  //   }
  //   if (infantcount > 0) {
  //     const PaxQuantity = {
  //       Code: 'INF',
  //       Quantity: infantcount,
  //     };
  //     BDFareRequestPax.push(PaxQuantity);
  //   }
  //   const IncludeVendorPref: any[] = [
  //     { Code: 'BG' },
  //     { Code: 'EK' },
  //     { Code: 'SQ' },
  //     { Code: 'BS' },
  //     { Code: 'TK' },
  //     { Code: 'QR' },
  //     { Code: 'GF' },
  //     { Code: 'SV' },
  //     { Code: 'KU' },
  //     { Code: 'CX' },
  //     { Code: 'UL' },
  //     { Code: 'AI' },
  //     { Code: 'TG' },
  //     { Code: 'UK' },
  //     { Code: 'MH' },
  //     { Code: 'WY' },
  //     { Code: 'FZ' },
  //   ];
  //   const SegmentList = [];
  //   for (let i = 0; i < segments.length; i++) {
  //     const segment = segments[i];
  //     const DepFrom = segment.depfrom;
  //     const ArrTo = segment.arrto;
  //     const DepDate = segment.depdate + 'T00:00:00';

  //     const SingleSegment = {
  //       RPH: i.toString(),
  //       DepartureDateTime: DepDate,
  //       OriginLocation: {
  //         LocationCode: DepFrom,
  //       },
  //       DestinationLocation: {
  //         LocationCode: ArrTo,
  //         LocationType: 'C',
  //         AllAirports: true,
  //       },
  //       TPA_Extensions: {
  //         IncludeVendorPref: IncludeVendorPref,
  //       },
  //     };

  //     SegmentList.push(SingleSegment);
  //   }
  // }

  private determineJourneyType(segments: any[]): string {
    if (segments.length === 1) {
      return '1';
    }
    if (segments.length === 2) {
      if (
        segments[0].Destination === segments[1].Origin &&
        segments[0].Origin === segments[1].Destination
      ) {
        return '2';
      }
      return '3';
    }
    return '3';
  }
}
