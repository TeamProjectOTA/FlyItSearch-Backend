import { Body, Controller, Param, Post, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingID, CreateSaveBookingDto } from './booking.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
import { AuthService } from 'src/auth/auth.service';
import { BothTokensGuard } from 'src/auth/both-tokens.guard';

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
  @UseGuards(BothTokensGuard)
  @Post('flh/air-book/')
  async airbook(
     @Body() data: FlbFlightSearchDto,
    @Headers() header: Headers,
  ) {
   
    const currentTimestamp = new Date();
    return await this.flyHubService.airbook(data,header,currentTimestamp,);
  }
  @ApiBearerAuth('access_token')
  @Post('flh/cancel-ticket')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
  ): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto,header);
  }
  @Post('flh/air-retrive')
  async airRetrive(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto);
  }
  @ApiBearerAuth('access_token')
  @Post('testBooking')
  async bookingtest(@Body() data: any,@Headers() header: any): Promise<any> {
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
