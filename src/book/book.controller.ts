import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  File,
  ResponseDto,
  Designation,
  UserDetails,
  SsrType,
} from './book.model';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@ApiTags('Booking-Details')
@Controller('book')
export class BookController {
  constructor(private readonly fileupload: BookService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/AllFile',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<File> {
    return await this.fileupload.saveFile(file);
  }
  //Checking the dto file validity and data
  @Get()
  getUserInfo(): ResponseDto {
    const userDetails: UserDetails = {
      designation: Designation.Mr,
      address: '',
      mobileNumber: '',
      department: '',
      avatar: '',
      gender: '',
      passportNumber: '',
      passportExpireDate: '',
      country: '',
      city: '',
      postCode: '',
      passport: '',
      seatPreference: 'No Preference',
      mealPreference: '',
      nationality: '',
      frequentFlyerNumber: '',
      passportCopy: '',
      visaCopy: '',
      quickPick: true,
      titleName: '',
      givenName: '',
      surName: '',
      address1: '',
      dateOfBirth: '',
      age: '',
      username: 'hasibul.flyitsearch_lwyhq1ug',
      email: 'hasibul.flyitsearch@gmail.com',
      referralCode: 'ST88238957',
      otherPassengers: [],
      ssr: [
        {
          type: 'Wheelchair',
          ssr: [
            {
              code: 'WCHR',
              name: 'Passenger can not walk short distance up or down stairs.',
            },
            {
              code: 'WCHS',
              name: 'Passenger can not walk short distance, but not up or down stairs',
            },
            {
              code: 'WCHC',
              name: 'Passenger cannot walk any distance and will require the aisle chair to board.',
            },
            { code: 'WCOB', name: 'On-board aisle wheelchair requested' },
            {
              code: 'WCMP',
              name: 'Passenger is traveling with a manual wheelchair.',
            },
            {
              code: 'WCBD',
              name: 'Passenger is traveling with a dry cell battery-powered wheelchair.',
            },
            {
              code: 'WCBW',
              name: 'Passenger is traveling with a wet cell battery-powered wheelchair.',
            },
          ],
        },
        {
          type: 'Meal',
          ssr: [
            { code: 'AVML', name: 'ASIAN VEGETARIAN MEAL' },
            { code: 'BBML', name: 'INFANT/BABY FOOD' },
            { code: 'CHML', name: 'CHILD MEAL' },
            { code: 'DBML', name: 'DIABETIC MEAL' },
            { code: 'SFML', name: 'SEA FOOD MEAL' },
            { code: 'MOML', name: 'MUSLIM MEAL' },
          ],
        },
        {
          type: 'Other',
          ssr: [
            { code: 'BLND', name: 'Passenger is blind or has reduced vision' },
            { code: 'DEAF', name: 'Passenger is deaf or hard of hearing' },
          ],
        },
      ],
    };

    return {
      code: 'SUCCESS',
      message: 'Successfully retrieve user information',
      response: userDetails,
    };
  }
}
