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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from './entities/user.entity';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signUp')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiBearerAuth('access_token')
  @Patch('/updateUserProfile')
  update(@Headers() header: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(header, updateUserDto);
  }

  @ApiBearerAuth('access_token')
  @Get('/admin/allUser')
  findAllUser(@Headers() header: Headers) {
    return this.userService.allUser(header); // find all not working have to fix it .Problem found on (5-5-2024).solved on the same day
  }
  @ApiBearerAuth('access_token')
  @Get('/bookings/:bookingStatus')
  async findUserWithBookings(
    @Headers() header: Headers,
    @Param('bookingStatus') bookingStatus: string,
  ): Promise<Partial<User>> {
    return this.userService.findUserWithBookings(header, bookingStatus);
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Get('admin/allUserBookings')
  async findAllUserWithBookings(): Promise<any> {
    return this.userService.findAllUserWithBookings();
  }


  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('/profileInfo')
  async findOneUser(@Headers() header: Headers): Promise<any> {
    return this.userService.findOneUser(header);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard) 
  @Get('/findAllTravelBuddy')
  async getUserTravelBuddies(@Headers() header: Headers) {
    const travelBuddies = await this.userService.findUserTravelBuddy(header);
    return travelBuddies;
  }
}
