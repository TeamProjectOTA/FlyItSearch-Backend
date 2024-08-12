import { Body, Controller, Param, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingID, CreateSaveBookingDto } from './booking.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Booking-Details')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly flyHubService: FlyHubService,
    private readonly flyHubUtil: FlyHubUtil,
    private readonly authService:AuthService
  ) {}

  @ApiBearerAuth('access_token')
  @Post('flh/air-book/')
  async airbook(
     @Body() data: FlbFlightSearchDto,
    @Headers() header: Headers,
  ) {
   await this.authService.verifyBothToken(header)
    const currentTimestamp = new Date();
    return currentTimestamp
    //return await this.flyHubService.airbook(data, currentTimestamp, header);
  }

  @Post('flh/cancel-ticket/:uuid')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Param('uuid') uuid: string,
    @Headers() header: Headers,
  ): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto, uuid, header);
  }
  @Post('flh/air-retrive')
  async airRetrive(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto);
  }
  @Post('testBooking')
  async bookingtest(@Body() data: any, header: any): Promise<any> {
    return await this.flyHubUtil.saveBookingData(data, header);
  }
  @Post('one/testBooking')
  async test(@Body() data: any): Promise<any> {
    return await this.flyHubUtil.restBFMParser(data);
  }
  @ApiBearerAuth('access_token')
  @Post('/save-booking')
  async SaveBooking(
    @Body() createSaveBookingDto: CreateSaveBookingDto,
    @Headers() header: Headers,
  ) {
    return this.bookingService.saveBooking(createSaveBookingDto, header);
  }
}
