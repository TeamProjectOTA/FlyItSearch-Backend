import {
  Body,
  Controller,
  Post,
  Headers,
  NotFoundException,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { Deposit } from './deposit.model';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';

@ApiTags('Deposit Api')
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('/createDeposit')
  @UseGuards(UserTokenGuard)
  async createDeposit(
    @Body() depositData: Partial<Deposit>,
    @Headers() header: any,
  ): Promise<Deposit> {
    if (!depositData || Object.keys(depositData).length === 0) {
      throw new NotFoundException('Deposit data cannot be empty');
    }
    return this.depositService.createDeposit(depositData, header);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('user/findAll')
  async findAllDepositForUser(@Headers() header: any) {
    return this.depositService.getDepositforUser(header);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Get('admin/findAll')
  async findAllDepositForAdmin() {
    return this.depositService.findAllDeposit();
  }
  @Patch('/admin/depositAction/:depositId')
  @UseGuards(AdmintokenGuard)
  async actionOnDeposit(
    @Body() updateData: { status: string; rejectionReason: string },
    @Param('depositId') depositId: string,
  ) {
    return this.depositService.updateDepositStatus(depositId, updateData);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('user/wallet')
  async wallet(@Headers() header: any) {
    return await this.depositService.wallet(header);
  }
}
