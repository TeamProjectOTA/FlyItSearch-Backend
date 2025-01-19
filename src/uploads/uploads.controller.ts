import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Headers,
  UseGuards,
  Res,
  Param,
  UploadedFiles,
  Delete,
  Query,
  Patch,
  Body,
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

  @Post('uploadVisitPlace/:tourPackageId')
  @UseInterceptors(FilesInterceptor('images', 6)) 
  async uploadVisitPlaceImages(
    @Param('tourPackageId') tourPackageId: number,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.uploadsService.saveVisitPlaceImages(tourPackageId, files);
  }
  @Patch('updateVisitPlace/:tourPackageId')
  @UseInterceptors(FileInterceptor('file')) 
  async patchVisitPlaceImageByTourPackage(
    @Param('tourPackageId') tourPackageId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    try {
      return await this.uploadsService.updateVisitPlaceByTourPackage(tourPackageId, file);
    } catch (error) {
      throw new BadRequestException('Failed to update images for the tour package. ' + error.message);
    }
  }

  
  @Post('uploadMainImages/:tourPackageId')
  @UseInterceptors(FilesInterceptor('images', 6)) 
  async uploadMainImage(
    @Param('tourPackageId') tourPackageId: number,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (!files) {
      throw new BadRequestException('No file provided for upload.');
    }

    return this.uploadsService.saveMainImage(tourPackageId, files);
  }
  @Patch('updateMainImages/:tourPackageId')
  @UseInterceptors(FileInterceptor('file')) 
  async updateMainImages(
    @Param('tourPackageId') tourPackageId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    try {
      return await this.uploadsService.mainImageUpdateByTourPackage(tourPackageId, file);
    } catch (error) {
      throw new BadRequestException('Failed to update images for the tour package. ' + error.message);
    }
  }
  
  

  @Post('upload/update')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageUpdate(
    @UploadedFile() file: any, 
    @Body('existingImageLink') existingImageLink?: string
  ) {
    try {
      console.log(file,existingImageLink)
      const result = await this.uploadsService.uploadImageUpdate(file, existingImageLink);
      return result;
    } catch (error) {
      return { status: 'error', message: error.message };
    }
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
