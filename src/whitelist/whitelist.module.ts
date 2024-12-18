import { Module } from '@nestjs/common';
import { WhitelistService } from './whitelist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhitelistController } from './whitelist.controller';
import { IPWhitelist } from './whitelist.model';

@Module({
  imports:[TypeOrmModule.forFeature([IPWhitelist])],
  providers: [WhitelistService],
  exports:[WhitelistService],
  controllers: [WhitelistController]
})
export class WhitelistModule {}
