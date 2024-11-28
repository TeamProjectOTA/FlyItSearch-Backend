import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAllUser(
    @Headers() header: Headers,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return this.userService.allUser(header, pageNumber, limitNumber);
  }

  @ApiBearerAuth('access_token')
  @Get('/bookings/:bookingStatus')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findUserWithBookings(
    @Headers() header: Headers,
    @Param('bookingStatus') bookingStatus: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<Partial<User>> {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return this.userService.findUserWithBookings(
      header,
      bookingStatus,
      pageNumber,
      limitNumber,
    );
  }

  @Get('allUserBookings')
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAllUserWithBookings(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<any> {
    return this.userService.findAllUserWithBookings(page, limit);
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
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getUserTravelBuddies(
    @Headers() header: Headers,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const travelBuddies = await this.userService.findUserTravelBuddy(
      header,
      pageNumber,
      limitNumber,
    );
    return travelBuddies;
  }

  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('/oneUserAllTransection')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findOneUserTransection(
    @Headers() header: Headers,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return await this.userService.findUserTransection(
      header,
      pageNumber,
      limitNumber,
    );
  }

  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Get('admin/ledgerReport')
  async findAllUserTransection(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    return await this.userService.allTransection(pageNumber, limitNumber);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Patch('admin/userAccountAction')
  async updateUserActivation(
    @Body('email') email: string,
    @Body('action') action: string,
  ) {
    return await this.userService.updateUserActivation(email, action);
  }
}
