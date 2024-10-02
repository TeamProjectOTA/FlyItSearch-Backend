import { Body, Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';

@ApiTags('Admin-Dashboard')
@Controller('adminDashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  //@UseGuards(AdmintokenGuard)
  @Get('allStateOfToday/:date')
  async findAllDeposit(@Param('date') date: string) {
    return await this.adminDashboardService.findAll(date);
  }
}
