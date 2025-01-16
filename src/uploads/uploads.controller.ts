import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
@ApiTags('Uploads')
@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @UseGuards(UserTokenGuard)
  @Post('profilePicture/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'image/jpg',
          'image/png',
          'image/jpeg',
          'image/gif',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('File type must be jpeg, jpg, png, gif'),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @Headers() header: Headers,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded or invalid file format.');
    }

    return await this.uploadsService.create(header, file);
  }

   @UseGuards(UserTokenGuard)
  @Post('/uploadDocuments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File,@Res() res: Response) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG and PNG are allowed.',
      );
    }
    if (file.size > maxSize) {
      throw new BadRequestException(
        'File size exceeds the maximum limit of 5MB.',
      );
    }
    return this.uploadsService.uploadImage(file,res);
  }

  // @Post("/test")
  // @UseInterceptors(FileInterceptor('file'))
  // async test(@UploadedFile() file: Express.Multer.File,@Res() res: Response){
  //   return await this.uploadsService.test(file,res)

  // }
//   @UseGuards(UserTokenGuard)
//   @Post('/test')
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: memoryStorage(),
//       limits: { fileSize: 5 * 1024 * 1024 },
//       fileFilter: (req, file, cb) => {
//         const allowedMimeTypes = [
//           'image/jpg',
//           'image/png',
//           'image/jpeg',
//           'image/gif',
//         ];
//         if (allowedMimeTypes.includes(file.mimetype)) {
//           cb(null, true);
//         } else {
//           cb(
//             new BadRequestException('File type must be jpeg, jpg, png, gif'),
//             false,
//           );
//         }
//       },
//     }),
//   )
//   async peofilePicture(
//     @Headers() header: Headers,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded or invalid file format.');
//     }

//     return await this.uploadsService.test(header, file);
//   }
}
