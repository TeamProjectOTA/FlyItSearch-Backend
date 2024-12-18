import { Module } from '@nestjs/common';
import { Whitelist } from './whitelist';

@Module({
  providers: [Whitelist]
})
export class WhitelistModule {}
