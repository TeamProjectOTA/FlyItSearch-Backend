import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingSave } from 'src/book/booking.model';
import { SslCommerzPayment } from 'sslcommerz';
import { Repository } from 'typeorm';
@Injectable()
export class PaymentService {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;

  constructor(
   @InjectRepository(BookingSave)
   private readonly bookingSaveRepository:Repository<BookingSave>

  ) {
    this.storeId = process.env.STORE_ID;
    this.storePassword = process.env.STORE_PASSWORD;
    this.isLive = false; // Use true for live environment
  }
  async dataModification(SearchResponse: any): Promise<any> {
    const booking = SearchResponse[0];
    let tripType: string;
    if (booking?.AllLegsInfo?.length === 1) {
      tripType = 'OneWay';
    } else if (booking?.AllLegsInfo?.length === 2) {
      if (
        booking?.AllLegsInfo[0]?.ArrTo === booking?.AllLegsInfo[1]?.DepFrom &&
        booking?.AllLegsInfo[0]?.DepFrom === booking?.AllLegsInfo[1]?.ArrTo
      ) {
        tripType = 'Return';
      } else {
        tripType = 'Multistop';
      }
    } else {
      tripType = 'Multistop';
    }

    const flightDateTime = new Date(booking?.AllLegsInfo[0]?.DepDate);
    const currentDateTime = new Date();

    const timeDifference = flightDateTime.getTime() - currentDateTime.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const airTicketPrice = booking?.NetFare;
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.025);//2.5% charge added in sslcomerz
    const total_amount = Math.ceil(airTicketPrice + paymentGatwayCharge);
    const hours_till_departure = ` ${hoursDifference} hrs ${minutesDifference} mins`;
    const pnr = booking?.PNR;
    const passenger = booking?.PassengerList?.[0];
    const name =
      `${passenger?.FirstName || ''} ${passenger?.LastName || ''}`.trim();
    const email = passenger?.Email;
    const city = passenger?.CountryCode;
    const postCode = '1206';
    const phone = passenger?.ContactNumber;
    const depfrom = booking?.AllLegsInfo[0]?.DepFrom||"DAC";
    const arrto = booking?.AllLegsInfo[(booking?.AllLegsInfo).length - 1]?.ArrTo||"DXB";
    const bookingId=booking?.BookingId
    const paymentData = {
      total_amount: total_amount,
      hours_till_departure: hours_till_departure,
      flight_type: tripType,
      pnr: pnr,
      journey_from_to: `${depfrom}-${arrto}`,
      cus_name: name,
      cus_email: email,
      cus_city: city,
      cus_postcode: postCode,
      cus_country: 'Bangladesh',
      cus_phone: phone,
    };

    
    return {
      url: await this.initiatePayment(paymentData,bookingId),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }
  async initiatePayment(paymentData: any,bookingId:string,): Promise<string> {
    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;

    const bookingSave = await this.bookingSaveRepository.findOne( {where: { bookingId: bookingId}});
    if(bookingSave.bookingStatus=="Booked"){
    const data = {
      total_amount: paymentData.total_amount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `http://localhost:8080/payment/success/${bookingId}`,
      fail_url: 'http://localhost:8080/payment/fail',
      cancel_url: 'http://localhost:8080/payment/cancel',
      ipn_url: 'http://localhost:8080/payment/ipn',
      shipping_method: 'NO',
      product_name: 'Air Ticket',
      product_category: 'air ticket',
      product_profile: 'airline-tickets',
      hours_till_departure: paymentData.hours_till_departure,
      flight_type: paymentData.flight_type,
      pnr: paymentData.pnr,
      journey_from_to: paymentData.journey_from_to,
      third_party_booking: 'No',
      cus_name: paymentData.cus_name,
      cus_email: paymentData.cus_email,
      cus_city: paymentData.cus_city,
      cus_postcode: paymentData.cus_postcode,
      cus_country: 'Bangladesh',
      cus_phone: paymentData.cus_phone,
    };
    
    try{
      const apiResponse = await sslcommerz.init(data);
      return apiResponse?.GatewayPageURL;}
      catch(error){
        console.log(error)
        return error
      }
    }else {
     return`The booking with ${bookingId} id was already ${bookingSave.bookingStatus}`
    }
    
  }

  async validateOrder(val_id: string, bookingId?: any) {
    const sslcommerz = new SslCommerzPayment(this.storeId, this.storePassword, this.isLive);
  
    const validationData = {
      val_id: val_id,
    };
  
    try {
      const response = await sslcommerz.validate(validationData);
      
      // if (response.status === 'VALID') {
      //     const bookingSave = await this.bookingSaveRepository.findOne( {where: { bookingId: bookingId.bookingId }});
      //     bookingSave.bookingStatus='IssueInProcess'
      //     await this.bookingSaveRepository.save(bookingSave)
      // }
      return response;
    } catch (error) {
      console.error('Error during payment validation:', error);
      throw new Error('Payment validation failed.');
    }
  }
  
  
  
  
  
}
