import { Module } from '@nestjs/common';
import { GoogleOuthController } from './google-outh.controller';
import { GoogleStrategy } from './extands.stragey';
import { GoogleOuthService } from './google-outh.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GoogleOuthController],
  providers: [GoogleStrategy, GoogleOuthService],
})
export class GoogleOuthModule {}
