import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { RateLimitingPipe } from 'src/rate-limiting/rate-limiting.pipe';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Patch(':passengerId')
  update(
    @Param('passengerId') passengerId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(passengerId, updateUserDto);
  }

  @ApiBearerAuth('access_token')
  @Get()
  @UsePipes(RateLimitingPipe)
  findAllUser(@Headers() header: Headers) {
    return this.userService.allUser(header); // find all not working have to fix it .Problem found on (5-5-2024).solved on the same day
  }
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/user/upload',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async fileUpload(@UploadedFile() file) {
    if (!file) {
      throw new BadRequestException();
    }
    return 'successfully uploaded the file';
  }
}
