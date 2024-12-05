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
  searchResultDtobdf,
  ShoppingCriteriaDto,
  TravelPreferencesDto,
} from './Dto/bdfare.model';
import { BfFareUtil } from './bdfare.util';
import { BookingDataDto, BookingID, BookingSave } from 'src/book/booking.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class BDFareService {
  private readonly apiUrl: string = process.env.BDFareAPI_URL;
  private readonly apiKey: string = process.env.BDFareAPI_KEY;

  constructor(
    private readonly bdfareUtil: BfFareUtil,
    private readonly mailService: MailService,
  ) {}

  private transformToRequestDto(
    flightSearchModel: FlightSearchModel,
  ): RequestDto {
    const originDest = flightSearchModel.segments.map((segment) => {
      const originDepRequest = new OriginDepRequestDto();
      originDepRequest.iatA_LocationCode = segment.depfrom;
      originDepRequest.date = segment.depdate;
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
    shoppingCriteria.returnUPSellInfo = false;
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

    //return requestDto
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
      //return response.data
      return await this.bdfareUtil.afterSerarchDataModifierBdFare(
        response.data.response,
        tripType,
      );
    }
    return [];
  }
  async fareRules(data: searchResultDtobdf) {
    const transformedData = {
      traceId: data.SearchId,
      offerId: data.ResultId[0], // Assuming you only need the first item from ResultId array
    };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/FareRules`,
        transformedData,
        {
          headers: {
            'X-API-KEY': this.apiKey,
          },
        },
      );

      return response.data.response;
    } catch (error) {
      console.error('Error calling external API', error);
      throw new HttpException(
        'Error calling external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async offerPrice(data: searchResultDtobdf): Promise<any> {
    const transformedData = {
      traceId: data.SearchId,
      offerId: data.ResultId,
    };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/OfferPrice`,
        transformedData,
        {
          headers: {
            'X-API-KEY': this.apiKey,
          },
        },
      );
      //console.log(response)
      //return response.data.response
      return await this.bdfareUtil.afterSerarchDataModifierBdFare(
        response.data.response,
      );
    } catch (error) {
      console.error('Error calling external API', error);
      throw new HttpException(
        'Error calling external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async miniRule(data: searchResultDtobdf): Promise<any> {
    const transformedData = {
      traceId: data.SearchId,
      offerId: data.ResultId[0],
    };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/MiniRule`,
        transformedData,
        {
          headers: {
            'X-API-KEY': this.apiKey,
          },
        },
      );
      return response.data.response;
    } catch (error) {
      console.error('Error calling external API', error);
      throw new HttpException(
        'Error calling external API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async flightBooking() {}

  async flightRetrieve(BookingID: BookingID): Promise<any> {
    const orderReference = { orderReference: BookingID.BookingID };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/OrderRetrieve`,
        orderReference,
        {
          headers: {
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      //return response.data.response
      return await this.bdfareUtil.airRetrive(response.data.response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || error.message;
      }
    }
  }

  async flightBookingCancel(BookingID: BookingID): Promise<any> {
    const orderReference = { orderReference: BookingID.BookingID };
    try {
      const response: AxiosResponse = await axios.post(
        `${this.apiUrl}/OrderCancel`,
        orderReference,
        {
          headers: {
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.response.orderStatus == 'Cancelled') {
        const airRetrive = await this.flightRetrieve(BookingID);
        const status = response.data.response.orderStatus;
        const bookingId = response.data.response.orderReference;
        const email = airRetrive[0]?.PassengerList[0]?.Email;
        //console.log(status,bookingId,email)
        await this.mailService.cancelMail(bookingId, status, email);
        return airRetrive;
      }
    } catch (error) {
      console.log(error);
    }
  }
  async flightBookingChange() {}

  private bookingDataModification(data: BookingDataDto) {
    const { Passengers } = data;
    const dataModified = {
      traceId: data.SearchId,
      offerId: [data.ResultId[0]],
      request: {
        contactInfo: {
          phone: {
            phoneNumber: Passengers[0]?.ContactNumber.slice(3), 
            countryDialingCode: Passengers[0]?.ContactNumber.slice(0, 3), 
          },
          emailAddress: Passengers[0]?.Email,
        },
        paxList: Passengers.map((passenger) => ({
          ptc: passenger?.PaxType,
          individual: {
            givenName: passenger?.FirstName,
            surname: passenger?.LastName,
            gender: passenger?.Gender,
            birthdate: passenger?.DateOfBirth,
            nationality: passenger?.PassportNationality,
            identityDoc: {
              identityDocType: 'Passport',
              identityDocID: passenger?.PassportNumber,
              expiryDate: passenger?.PassportExpiryDate,
            },
            ...(passenger.PaxType === 'Infant' && {
              associatePax: {
                givenName:
                  Passengers.find((p) => p.IsLeadPassenger)?.FirstName || '',
                surname:
                  Passengers.find((p) => p.IsLeadPassenger)?.LastName || '',
              },
            }),
          },
          sellSSR:
            passenger?.FFAirline || passenger?.SSRType || passenger?.SSRRemarks
              ? [
                  {
                    ssrRemark: passenger?.SSRRemarks,
                    ssrCode: passenger?.SSRType,
                    loyaltyProgramAccount: {
                      airlineDesigCode: passenger?.FFAirline,
                      accountNumber: passenger?.FFNumber,
                    },
                  },
                ]
              : [],
        })),
      },
    };

    return dataModified;
  }

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
