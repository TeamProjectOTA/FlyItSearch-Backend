import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { IpService } from './ip.service';
import { ApiTags } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';

@ApiTags('SearchCount')
@Controller('SearchCount')
export class IpController {
  constructor(private readonly ipService: IpService) {}

  //@UseGuards(AdmintokenGuard)
  @Patch('admin/updatelimit/:email/:points')
  async searchCount(
    @Param('email') email: string,
    @Param('points') points: number,
  ) {
    return await this.ipService.update(email, points);
  }
}
