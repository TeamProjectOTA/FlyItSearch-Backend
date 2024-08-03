import {
  Body,
  Controller,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookingID, CreateSaveBookingDto,  } from './book.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';

@ApiTags('Booking-Details')
@Controller('book')
export class BookController {
  constructor(
    private readonly bookingService: BookService,
    private readonly flyHubService: FlyHubService,
    private readonly flyHubUtil: FlyHubUtil,
  ) {}
  // @Post('/passportcopy')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './src/AllFile',
  //       filename: (req, file, cb) => {
  //         cb(null, `${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
  //   return await this.bookingService.saveFile(file);
  // }

  @Post('flh/air-book/:uuid')
  async airbook(@Body() data: FlbFlightSearchDto, @Param('uuid') uuid: string,@Headers() header: Headers) {
    const currentTimestamp=new Date()
    return this.flyHubService.airbook(data, uuid,currentTimestamp,header);
  }

  @Post('flh/cancel-ticket/:uuid')
  async aircanel(
    @Body() bookingIdDto: BookingID,
    @Param('uuid') uuid: string,
  ): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto, uuid);
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
