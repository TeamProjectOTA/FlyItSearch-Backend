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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
  @Get()
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
