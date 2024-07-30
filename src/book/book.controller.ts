import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookingID, File } from './book.model';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FlyHubService } from 'src/flight/API Utils/flyhub.flight.service';
import { FlbFlightSearchDto } from 'src/flight/API Utils/Dto/flyhub.model';
import { FlyHubUtil } from 'src/flight/API Utils/flyhub.util';

@ApiTags('Booking-Details')
@Controller('book')
export class BookController {
  constructor(
    private readonly fileupload: BookService,
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
  //   return await this.fileupload.saveFile(file);
  // }

  @Post('flh/air-book/:uuid')
  async airbook(@Body() data: FlbFlightSearchDto,@Param('uuid')uuid:string) {
    return this.flyHubService.airbook(data,uuid);
  }

  @Post('flh/cancel-ticket/:uuid')
  async aircanel(@Body() bookingIdDto: BookingID,@Param('uuid')uuid:string): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto,uuid);
  }
  @Post('flh/air-retrive')
  async airRetrive(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto);
  }
  @Post('testBooking')
  async bookingtest(@Body() data: any): Promise<any> {
    return await this.flyHubUtil.bookingDataTransformerFlyhb(data);
  }
  @Post('one/testBooking')
  async test(@Body() data: any): Promise<any> {
    return await this.flyHubUtil.restBFMParser(data);
  }
}
