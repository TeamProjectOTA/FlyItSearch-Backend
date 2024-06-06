import {
  Controller,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
  Get,
  Query,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { HomepageService } from './homepage.service';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Header, HeaderDto } from './header.model';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';
import { Response } from 'express';

@ApiTags('Homepage-Api')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly fileupload: HomepageService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './src/AllFile/sliderHomepage',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Header[]> {
    console.log('Files:', files);
    return await this.fileupload.saveFiles(files);
  }
  @Get(':id')
  async getFile(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const file = await this.fileupload.getFileById(id);
    if (!file) {
      res.status(404).send('File not found');
      return;
    }
    const filePath = join(process.cwd(), file.path);
    res.sendFile(filePath);
  }
  @Get()
  async findMultiple(@Query('ids') ids: string): Promise<Partial<Header>[]> {
    const idArray = ids.split(',').map((id) => parseInt(id, 10));

    if (idArray.some(isNaN)) {
      throw new BadRequestException('Invalid ids provided');
    }

    return this.fileupload.findMultiple(idArray);
  }
}
