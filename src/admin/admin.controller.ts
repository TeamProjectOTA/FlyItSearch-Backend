import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @ApiBearerAuth('access_token')
  @Post()
  create(@Body() createAdminDto: CreateAdminDto, @Headers() header: Headers) {
    return this.adminService.create(createAdminDto, header);
  }
  @ApiBearerAuth('access_token')
  @Get(':uuid')
  findOne(@Headers() header: Headers, @Param('uuid') uuid: string) {
    return this.adminService.findOne(header, uuid);
  }
  @ApiBearerAuth('access_token')
  @Patch(':uuid')
  async update(
    @Headers() header: Headers,
    @Body() updateAdminDto: UpdateAdminDto,
    @Param('uuid') uuid: string,
  ) {
    return await this.adminService.update(header, updateAdminDto, uuid);
  }

  @ApiBearerAuth('access_token')
  @Delete(':uuid')
  remove(@Headers() header: Headers, @Param('uuid') uuid: string) {
    return this.adminService.remove(header, uuid);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAll(@Headers() header: Headers) {
    return this.adminService.findAll(header);
  }
  @ApiBearerAuth('access_token')
  @Get('/user/:passengerId')
  findUser(
    @Headers() header: Headers,
    @Param('passengerId') passengerId: string,
  ) {
    return this.adminService.findOneUser(passengerId, header);
  }
  @ApiBearerAuth('access_token')
  @Delete('/user/:passengerId')
  removeuser(
    @Headers() header: Headers,
    @Param('passengerId') passengerId: string,
  ) {
    return this.adminService.removeUser(passengerId, header);
  }
  @ApiBearerAuth('access_token')
  @Post('/cancelTicket/:bookingId')
  async allBooking(
  @Headers() header: Headers,
  @Param('bookingId') bookingId: string,
  @Body('reason') reason:string
) {
    return this.adminService.ticketCancel(bookingId,reason,header);
  }


}
