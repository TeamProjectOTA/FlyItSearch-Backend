import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { dataDto } from './homepage.model';
@ApiTags('Homepage-Api')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homePageService: HomepageService) {}
  @ApiBearerAuth('access_token')
  //@UseGuards(AdmintokenGuard)
  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'slider', maxCount: 5 },
    ]),
  )
  async uploadBannerAndSlider(
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      slider?: Express.Multer.File[];
    },
    @Body() data: dataDto,
  ) {
    return this.homePageService.uploadBannerAndSlider(files, data);
  }
  @ApiBearerAuth('access_token')
  // @UseGuards(AdmintokenGuard)
  @Get('data')
  async data() {
    return this.homePageService.getalldata();
  }
}
