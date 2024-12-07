import {
  Body,
  Controller,
  Param,
  Post,
  Headers,
  UnauthorizedException,
  UseGuards,
  Query,
  Get,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingDataDto, BookingID, CreateSaveBookingDto } from './booking.model';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BDFareService } from 'src/flight/API Utils/bdfare.flights.service';

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
  @Post('flh/airBook/')
  async airbook(@Body() data: FlbFlightSearchDto, @Headers() header: Headers) {
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();

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
    );
  }
  @UseGuards(UserTokenGuard)
  @ApiBearerAuth('access_token')
  @Post('flh/cancelBooking')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
  ): Promise<any> {
    return await this.flyHubService.aircancel(bookingIdDto, header);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('flh/airRetrive')
  async airRetrive(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
  ): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto, header);
  }
  @Post('bdfare/cancelBooking')
  async bdfCancel(@Body() bookingIdDto: BookingID) {
    return await this.bdfareService.flightBookingCancel(bookingIdDto);
  }

  @Post('bdfare/airRetrive')
  async airRetriveBDF(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.bdfareService.flightRetrieve(bookingIdDto);
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
  @Post('flh/makeTicket')
  @UseGuards(AdmintokenGuard)
  async ticketMake(@Body() bookingIdDto: BookingID) {
    return await this.flyHubService.makeTicket(bookingIdDto);
  }
  @Post('api2/booking')
  async bdfareBook(@Body() bookingdto:BookingDataDto,@Headers() header: Headers){
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
    return await this.bdfareService.flightBooking(bookingdto,header,
      dhakaTimeFormatted,
      personIds,)
  }
}
