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
import { BookingID, CreateSaveBookingDto, data } from './booking.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Booking-Details')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly flyHubService: FlyHubService,
  ) {}

  @ApiBearerAuth('access_token')
  //@UseGuards(UserTokenGuard)
  @Post('flh/airBook/')
 
  async airbook(@Body() data: FlbFlightSearchDto, @Headers() header: Headers) {
    const nowdate = new Date(Date.now());
    const dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    const dhakaTime = new Date(nowdate.getTime() + dhakaOffset);
    const dhakaTimeFormatted = dhakaTime.toISOString();
    // const { Passengers } = data;
    // const links = [];
    // await Promise.all(Passengers.map(async (passenger, index) => {
    //   const passengerLinks: any = {}; 
  
    //   const passportFile = files.find(file => file.fieldname === `passport_${index}`);
    //   const visaFile = files.find(file => file.fieldname === `visa_${index}`);
  
    //   if (passportFile) {
    //     const passportUrl = await this.bookingService.uploadImage(passportFile, `passport_${passenger.PassportNumber}`);
    //     passengerLinks.passportImageUrl = passportUrl; 
    //   }
  
    //   if (visaFile) {
    //     const visaUrl = await this.bookingService.uploadImage(visaFile, `visa_${passenger.PassportNumber}`);
    //     passengerLinks.visaImageUrl = visaUrl;
    //   } 
    //   links.push({
    //     PassengerName: `${passenger.FirstName} ${passenger.LastName}-${passenger.PassportNumber}`,
    //     ...passengerLinks, 
    //   });
    //   delete passenger.passport;
    //   delete passenger.visa;
    // }));
    // return {data ,links}
    return await this.flyHubService.airbook(data, header, dhakaTimeFormatted);
  }
  @UseGuards(UserTokenGuard)
  @ApiBearerAuth('access_token')
  @Post('flh/cancelBooking')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Headers() header: Headers,
  ): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto, header);
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

  @ApiBearerAuth('access_token')
  //@UseGuards(AdmintokenGuard)
  @Post('admin/flh/airRetrive')
  async airRetriveAdmin(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetriveAdmin(bookingIdDto);
  }

  // @ApiBearerAuth('access_token')
  // @Post('testBooking')
  // async bookingtest(
  //   @Body() data: data,
  //   @Headers() headers: any,
  //   @Query('bookingId') bookingId?: string,
  // ): Promise<any> {
  //   return await this.flyHubUtil.saveBookingData(data, headers, bookingId);
  // }

  // // @Post('one/testBooking')
  // // async test(@Body() data: any): Promise<any> {
  // //   return await this.flyHubUtil.restBFMParser(data);
  // // }
  // @ApiBearerAuth('access_token')
  // @Post('/save-booking')
  // async SaveBooking(
  //   @Body() createSaveBookingDto: CreateSaveBookingDto,
  //   @Headers() header: Headers,
  // ) {
  //   return this.bookingService.saveBooking(createSaveBookingDto, header);
  // }
  // @ApiBearerAuth('access_token')
  // @Get('/test')
  // async test(@Headers() header: Headers) {
  //   return;
  // }
  @UseGuards(AdmintokenGuard)
  @ApiBearerAuth('access_token')
  @Get('admin/allBooking/:bookingStatus')
  async findAll(@Param('bookingStatus') bookingStatus?: string) {
    return await this.bookingService.findAllBooking(bookingStatus);
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
}
