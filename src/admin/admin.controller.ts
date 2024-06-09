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

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @ApiBearerAuth('access_token')
  @Get(':adminId')
  findOne(@Headers() header: Headers, @Param('adminId') adminId: string) {
    return this.adminService.findOne(header, adminId);
  }

  @Patch(':adminId')
  update(
    @Headers() header: Headers,
    @Param('adminId') adminId: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(header, adminId, updateAdminDto);
  }

  @Delete(':adminId')
  remove(@Headers() header: Headers, @Param('adminId') adminId: string) {
    return this.adminService.remove(header, adminId);
  }

  @ApiBearerAuth('access_token')
  @Get()
  findAll(@Headers() header: Headers) {
    return this.adminService.findAll(header);
  }

  @Get('/user/:passengerId')
  findUser(
    @Headers() header: Headers,
    @Param('passengerId') passengerId: string,
  ) {
    return this.adminService.findOneUser(passengerId, header);
  }
  @Delete('/user/:passengerId')
  removeuser(
    @Headers() header: Headers,
    @Param('passengerId') passengerId: string,
  ) {
    return this.adminService.removeUser(passengerId, header);
  }
}
