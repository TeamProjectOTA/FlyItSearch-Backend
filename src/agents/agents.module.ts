import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from './entities/agents.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Agents]), AuthModule],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
