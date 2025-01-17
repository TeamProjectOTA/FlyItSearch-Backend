import {
  Body,
  Controller,
  Param,
  Post,
  Headers,
  UseGuards,
  Query,
  Get,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDataDto, BookingID } from './booking.model';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { BDFareService } from 'src/flight/API Utils/bdfare.flights.service';
import { Request } from 'express';

@ApiTags('Booking-Details')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly flyHubService: FlyHubService,
    private readonly bdfareService: BDFareService,
  ) {}

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('api1/airBook/')
  @ApiBody({ type: FlbFlightSearchDto })
  async airbook(
    @Body() data: FlbFlightSearchDto,
    @Headers() header: Headers,
    @Req() request: Request,
  ) {
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }

    const { Passengers } = data;
    const personIds: { index: number; visa?: string; passport?: string }[] = [];
    Passengers.forEach((passenger, index) => {
      const personData: { index: number; visa?: string; passport?: string } = {
        index: index + 1,
      };

      if (passenger.visa) {
        personData.visa = passenger.visa;
      }

      if (passenger.passport) {
        personData.passport = passenger.passport;
      }

      personIds.push(personData);

      delete passenger.visa;
      delete passenger.passport;
    });

    return await this.flyHubService.airbook(
      data,
      header,
      dhakaTimeFormatted,
      personIds,
      userIp,
    );
  }
  @UseGuards(UserTokenGuard)
  @ApiBearerAuth('access_token')
  @Post('api1/cancelBooking')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
  ): Promise<any> {
    return await this.flyHubService.aircancel(bookingIdDto, header);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('api1/airRetrive')
  async airRetrive(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
    @Req() request: Request,
  ): Promise<any> {
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }
    return await this.flyHubService.airRetrive(bookingIdDto, header, userIp);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('api2/cancelBooking')
  async bdfCancel(@Body() bookingIdDto: BookingID) {
    return await this.bdfareService.flightBookingCancel(bookingIdDto);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('api2/airRetrive')
  async airRetriveBDF(
    @Body() bookingIdDto: BookingID,
    @Req() request: Request,
    @Headers() header: Headers,
  ): Promise<any> {
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }
    return await this.bdfareService.flightRetrieve(
      bookingIdDto,
      header,
      userIp,
    );
  }
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Post('admin/flh/airRetrive')
  async airRetriveAdmin(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetriveAdmin(bookingIdDto);
  }
  @UseGuards(AdmintokenGuard)
  @ApiBearerAuth('access_token')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @Get('admin/allBooking/:bookingStatus')
  async findAll(
    @Param('bookingStatus') bookingStatus?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.bookingService.findAllBooking(bookingStatus, page, limit);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('/user/:bookingStatus')
  async findUserWithBookings(
    @Headers() header: Headers,
    @Param('bookingStatus') bookingStatus: string,
  ): Promise<any> {
    return this.bookingService.findUserWithBookings(header, bookingStatus);
  }
  @ApiBearerAuth('access_token')
  @Post('api1/makeTicket')
  @UseGuards(AdmintokenGuard)
  async ticketMake(@Body() bookingIdDto: BookingID) {
    return await this.flyHubService.makeTicket(bookingIdDto);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('api2/booking')
  async bdfareBook(
    @Body() bookingdto: BookingDataDto,
    @Headers() header: Headers,
    @Req() request: Request,
  ) {
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();

    const { Passengers } = bookingdto;
    const personIds: { index: number; visa?: string; passport?: string }[] = [];
    Passengers.forEach((passenger, index) => {
      const personData: { index: number; visa?: string; passport?: string } = {
        index: index + 1,
      };

      if (passenger.visa) {
        personData.visa = passenger.visa;
      }

      if (passenger.passport) {
        personData.passport = passenger.passport;
      }

      personIds.push(personData);

      delete passenger.visa;
      delete passenger.passport;
    });
    return await this.bdfareService.flightBooking(
      bookingdto,
      header,
      dhakaTimeFormatted,
      personIds,
      userIp,
    );
  }
}
