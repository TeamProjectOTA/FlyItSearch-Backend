import { Controller, Post, Headers, Body, UseGuards } from '@nestjs/common';
import { TransectionService } from './transection.service';
import { CreateTransectionDto } from './transection.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';

@ApiTags('WallletTransection')
@Controller('WalletTransection')
export class TransectionController {
  constructor(private readonly TranserctionService: TransectionService) {}
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('Wallet')
  async walletTransection(
    @Headers() header: Headers,
    @Body() transectionDto: CreateTransectionDto,
  ) {
    return await this.TranserctionService.paymentWithWallet(
      header,
      transectionDto,
    );
  }
}
