import { Module } from '@nestjs/common';
import { GoogleOuthController } from './google-outh.controller';
import { GoogleStrategy } from './extands.stragey';
import { GoogleOuthService } from './google-outh.service';
import { FacebookStrategy } from 'src/facebook-Outh/facebook.strategy';

@Module({
  controllers: [GoogleOuthController],
  providers: [GoogleStrategy, GoogleOuthService, FacebookStrategy],
})
export class GoogleOuthModule {}
