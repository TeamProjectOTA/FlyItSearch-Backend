import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { BookingIdSave, FlightSearchModel } from '../flight.model';
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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BDFareService {
  private readonly apiUrl: string = process.env.BDFareAPI_URL;
  private readonly apiKey: string = process.env.BDFareAPI_KEY;

  constructor(
    @InjectRepository(BookingIdSave)
    private readonly bookingIdSave: Repository<BookingIdSave>,
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
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
    shoppingCriteria.preferCombine=true;
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

  async flightBooking(bookingdata:BookingDataDto,  header: any,
    currentTimestamp: any,
    personIds: any,) {
    const data= this.bookingDataModification(bookingdata)
   //return data
    const OrderSellRequest = {
      method: 'post',
      maxBodyLength: Infinity,
      url:  `${this.apiUrl}/OrderSell`,
      headers: {
        'Content-Type': 'application/json',
       'X-API-KEY': this.apiKey,
      },
      data: data,
    };
    const OrderCreateRequest= {
      method: 'post',
      maxBodyLength: Infinity,
      url:  `${this.apiUrl}/OrderCreate`,
      headers: {
        'Content-Type': 'application/json',
       'X-API-KEY': this.apiKey,
      },
      data: data,
    };
   
      const response: AxiosResponse = await axios(OrderSellRequest);
      const response1: AxiosResponse = await axios(OrderCreateRequest);
   
    return await this.bdfareUtil.bookingDataTransformer(response1.data.response,header,currentTimestamp,personIds);
  }

  async flightRetrieve(BookingID: BookingID): Promise<any> {
    const findBooking = await this.bookingSaveRepository.findOne({
      where: { bookingId: BookingID.BookingID },
      relations: ['user'],
    });
    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
    });
    if(!bookingId){
      throw new NotFoundException("No booking found on this id")
    }
    const orderReference = { orderReference: bookingId.flyhubId };
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
      return await this.bdfareUtil.airRetrive(
        response.data.response,
        BookingID.BookingID,
        findBooking.bookingStatus,
        findBooking.TripType,
        findBooking.bookingDate,
        );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data || error.message;
      }
    }
  }

  async flightBookingCancel(BookingID: BookingID): Promise<any> {

    const bookingId = await this.bookingIdSave.findOne({
      where: { flyitSearchId: BookingID.BookingID },
    });
    if(!bookingId){
      throw new NotFoundException("No booking found on this id")
    }
    const orderReference = { orderReference: bookingId.flyhubId };
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
        const findBooking = await this.bookingSaveRepository.findOne({
          where: { bookingId: BookingID.BookingID },
          relations: ['user'],
        });
        findBooking.bookingStatus=response.data.response.orderStatus
        await this.bookingSaveRepository.save(findBooking)
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

  private bookingDataModification(data: any) {
    const { Passengers } = data;
  
    // Separate adults and infants
    const adults = Passengers.filter((p) => p.PaxType === 'Adult');
    const infants = Passengers.filter((p) => p.PaxType === 'Infant');
  
    const dataModified = {
      traceId: data.SearchId,
      offerId: [data.ResultId[0]],
      request: {
        contactInfo: {
          phone: {
            phoneNumber: Passengers[0]?.ContactNumber.slice(2),
            countryDialingCode: Passengers[0]?.ContactNumber.slice(0, 2),
          },
          emailAddress: Passengers[0]?.Email,
        },
        paxList: Passengers.map((passenger, index) => {
          const isInfant = passenger?.PaxType === 'Infant';
          const associatedAdult =
            isInfant && adults[index % adults.length]; // Cycle through adults for infants
  
          return {
            ptc: passenger?.PaxType,
            individual: {
              givenName: passenger?.FirstName,
              surname: passenger?.LastName,
              gender: passenger?.Gender,
              birthdate: passenger?.DateOfBirth,
              nationality: passenger?.CountryCode,
              ...(passenger?.PassportNumber || passenger?.PassportExpiryDate
                ? {
                    identityDoc: {
                      identityDocType: 'Passport',
                      identityDocID: passenger?.PassportNumber,
                      expiryDate: passenger?.PassportExpiryDate,
                    },
                  }
                : {}),
              ...(isInfant && associatedAdult && {
                associatePax: {
                  givenName: associatedAdult.FirstName,
                  surname: associatedAdult.LastName,
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
          };
        }),
      },
    };
  
    return dataModified;
  }
  
  private determineJourneyType(segments: any[]): string {
    if (!segments || segments.length === 0) {
      throw new Error("Segments array is empty or undefined.");
    }
  
    if (segments.length === 1) {
      return '1'; // One-way journey
    }
  
    if (segments.length === 2) {
      const [firstSegment, secondSegment] = segments;
  
      if (
        firstSegment.arrto === secondSegment.depfrom &&
        firstSegment.depfrom === secondSegment.arrto
      ) {
        return '2'; // Round-trip
      }
      return '3'; // Two segments but not a round-trip
    }
  
    return '3'; // Multi-city or complex journey
  }
  
}
