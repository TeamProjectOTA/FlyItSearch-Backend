import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { NewTicket, vendorTicket } from './admin-dashboard.model';

@ApiTags('Admin-Dashboard')
@Controller('adminDashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @UseGuards(AdmintokenGuard)
  @Get('allStateOfRange')
  @ApiQuery({
    name: 'startDate',
    type: 'string',
    required: true,
    example: '2024-01-01',
    description: 'The start date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'endDate',
    type: 'string',
    required: true,
    example: '2024-01-31',
    description: 'The end date in YYYY-MM-DD format',
  })
  async findAllDeposit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.adminDashboardService.findAll(startDate, endDate);
  }
@UseGuards(AdmintokenGuard)
  @Post('VendorTicket')
  async createTicket(@Body() ticketDataDTO: vendorTicket) {
    return this.adminDashboardService.vendorMakeTicket(ticketDataDTO);
  }
  @UseGuards(AdmintokenGuard)
  @Get()
  async getAllTickets() {
    return await this.adminDashboardService.findAllTickets();
  }
}
