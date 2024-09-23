import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { BookingSave } from 'src/book/booking.model';
import { Wallet } from 'src/deposit/deposit.model';
import { Transection } from 'src/transection/transection.model';
import { User } from 'src/user/entities/user.entity';
import { SslCommerzPayment } from 'sslcommerz';
import { Repository } from 'typeorm';
@Injectable()
export class PaymentService {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;

  constructor(
    @InjectRepository(BookingSave)
    private readonly bookingSaveRepository: Repository<BookingSave>,
    @InjectRepository(Transection)
    private readonly transectionRepository: Repository<Transection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly authService: AuthService,
  ) {
    this.storeId = process.env.STORE_ID;
    this.storePassword = process.env.STORE_PASSWORD;
    this.isLive = false; // Use true for live environment
  }
  async dataModification(SearchResponse: any, header: any): Promise<any> {
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
    const paymentGatwayCharge = Math.ceil(airTicketPrice * 0.035); // !Important some check the validation before adding the ammont. 2.5% charge added in sslcomerz
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
    const depfrom = booking?.AllLegsInfo[0]?.DepFrom || 'DAC';
    const arrto =
      booking?.AllLegsInfo[(booking?.AllLegsInfo).length - 1]?.ArrTo || 'DXB';
    const bookingId = booking?.BookingId;
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
      url: await this.initiatePayment(paymentData, bookingId, header),
      airTicketPrice: airTicketPrice,
      paymentGatwayCharge: paymentGatwayCharge,
      total_amount: total_amount,
    };
  }
  async initiatePayment(
    paymentData: any,
    bookingId: string,
    header: any,
  ): Promise<string> {
    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;

    const email = await this.authService.decodeToken(header);

    const bookingSave = await this.bookingSaveRepository.findOne({
      where: { bookingId: bookingId },
    });
  
    if (bookingSave.bookingStatus == 'Booked') {
      const data = {
        total_amount: paymentData.total_amount,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `http://localhost:8080/payment/success/${bookingId}/${email}`,
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

      try {
        const apiResponse = await sslcommerz.init(data);
        return apiResponse?.GatewayPageURL;
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      return `The booking with ${bookingId} id was already ${bookingSave.bookingStatus}`;
    }
  }

  async validateOrder(val_id: string, bookingId?: any, email?: any) {
    const sslcommerz = new SslCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );

    const validationData = {
      val_id: val_id,
    };
  

    try {
      const response = await sslcommerz.validate(validationData);

      if (response.status === 'VALID') {
        const user = await this.userRepository.findOne({
          where: { email: email },
        });
        const bookingSave = await this.bookingSaveRepository.findOne({
          where: { bookingId:bookingId },
        });
        bookingSave.bookingStatus = 'IssueInProcess';
        
        await this.bookingSaveRepository.save(bookingSave)
       
        const wallet = await this.walletRepository
          .createQueryBuilder('wallet')
          .innerJoinAndSelect('wallet.user', 'user')
          .where('user.email = :email', { email })
          .getOne();

        const airPlaneName = bookingSave.Curriername;
        const tripType = bookingSave.TripType;
        const depfrom = bookingSave?.laginfo[0]?.DepFrom;
        const arrto = bookingSave?.laginfo[(bookingSave?.laginfo).length - 1]?.ArrTo;
        let addTransection: Transection = new Transection();
        addTransection.tranId = response.tran_id;
        addTransection.tranDate = response.tran_date;
        addTransection.paidAmount = response.amount;
        addTransection.offerAmmount = response.store_amount;
        addTransection.bankTranId = response.bank_tran_id;
        addTransection.riskTitle = response.risk_title;
        addTransection.cardType = response.card_type;
        addTransection.cardIssuer = response.card_issuer;
        addTransection.cardBrand = response.card_brand;
        addTransection.cardIssuerCountry = response.card_issuer_country;
        addTransection.validationDate = response.validated_on;
        addTransection.status = 'Purchase';
        addTransection.walletBalance = wallet.ammount;
        addTransection.paymentType = 'Payment for air ticket';
        addTransection.currierName = airPlaneName;
        addTransection.requestType = `${depfrom}-${arrto},${tripType} Air Ticket `;
        addTransection.bookingId = bookingId;
        addTransection.user = user;
        await this.transectionRepository.save(addTransection);
      }
      return response;
    } catch (error) {
      console.error('Error during payment validation:', error);
      throw new Error('Payment validation failed.');
    }
  }
}
