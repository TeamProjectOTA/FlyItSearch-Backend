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
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiBearerAuth('access_token')
  @Patch('/update-user-profile')
  update(@Headers() header: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(header, updateUserDto);
  }

  @ApiBearerAuth('access_token')
  @Get('/admin/all-user')
  findAllUser(@Headers() header: Headers) {
    return this.userService.allUser(header); // find all not working have to fix it .Problem found on (5-5-2024).solved on the same day
  }
  @ApiBearerAuth('access_token')
  @Get('/bookings')
  async findUserWithBookings(@Headers() header: Headers): Promise<User> {
    return this.userService.findUserWithBookings(header);
  }
  @ApiBearerAuth('access_token')
  @Get('admin/all-user-bookings')
  async findAllUserWithBookings(@Headers() header: Headers): Promise<any> {
    return this.userService.findAllUserWithBookings(header);
  }

  // @Post('/upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './src/user/upload',
  //       filename: (req, file, cb) => {
  //         cb(null, `${file.originalname}`);
  //       },
  //     }),
  //   }),
  // )
  // async fileUpload(@UploadedFile() file) {
  //   if (!file) {
  //     throw new BadRequestException();
  //   }
  //   return 'successfully uploaded the file';
  // }
}
