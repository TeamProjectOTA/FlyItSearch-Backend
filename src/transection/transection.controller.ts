import { Controller, Post ,Headers, Body} from '@nestjs/common';
import { TransectionService } from './transection.service';
import { CreateTransectionDto } from './transection.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('WallletTransection')
@Controller('WalletTransection')
export class TransectionController {
  constructor(private readonly TranserctionService: TransectionService) {}
  @Post('Wallet')
  async walletTransection( @Headers() header: Headers,
  @Body() transectionDto: CreateTransectionDto,
) {
  return await this.TranserctionService.paymentWithWallet(header, transectionDto);
}
}
