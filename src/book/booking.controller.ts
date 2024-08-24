import {
  Body,
  Controller,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingID, CreateSaveBookingDto, data } from './booking.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';
import { AuthService } from 'src/auth/auth.service';
import { UserTokenGuard } from 'src/auth/both-tokens.guard';


@ApiTags('Booking-Details')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly flyHubService: FlyHubService,
    private readonly flyHubUtil: FlyHubUtil,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('flh/air-book/')
  async airbook(@Body() data: FlbFlightSearchDto, @Headers() header: Headers) {
    const currentTimestamp = new Date();
    return await this.flyHubService.airbook(data, header, currentTimestamp);
  }
  @UseGuards(UserTokenGuard)
  @ApiBearerAuth('access_token')
  @Post('flh/cancel-ticket')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers
  ): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto,header);
  }
  @Post('flh/air-retrive')
  async airRetrive(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto);
  }


  
  @ApiBearerAuth('access_token')
  @Post('testBooking')
  async bookingtest(
    @Body() data: data,
    @Headers() headers: any,
    @Query('bookingId') bookingId?: string,
  ): Promise<any> {
    return await this.flyHubUtil.saveBookingData(data, headers, bookingId);
  }
  
  // @Post('one/testBooking')
  // async test(@Body() data: any): Promise<any> {
  //   return await this.flyHubUtil.restBFMParser(data);
  // }
  @ApiBearerAuth('access_token')
  @Post('/save-booking')
  async SaveBooking(
    @Body() createSaveBookingDto: CreateSaveBookingDto,
    @Headers() header: Headers,
  ) {
    return this.bookingService.saveBooking(createSaveBookingDto, header);
  }
}
