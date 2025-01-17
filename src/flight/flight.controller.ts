import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { Flight, FlightSearchModel } from './flight.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { dataAny, FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto, searchResultDtobdf } from './API Utils/Dto/bdfare.model';
import { searchResultDto } from './API Utils/Dto/flyhub.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';

import { FlyHubUtil } from './API Utils/flyhub.util';
import { AuthService } from 'src/auth/auth.service';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { BfFareUtil } from './API Utils/bdfare.util';
import { BookingDataDto } from 'src/book/booking.model';
import { WhitelistGuard } from 'src/whitelist/whitelist.guard';
import { RateLimiterGuard } from 'src/ip/ratelimiterguard';

@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(
    private readonly sabreService: SabreService,
    private readonly bdFareService: BDFareService,
    private readonly flyHubService: FlyHubService,
    private readonly testservice: FlyHubUtil,
  ) {}

  // @Post('/flyhub')
  // async searchFlightsFlyhub(@Body() airSearchDto: FlyAirSearchDto) {
  //   const result = await this.flyHubService.searchFlights(airSearchDto);
  //   return result;
  // }

  // @Post('/bdFare')
  // async getApiResponse(@Body() bdfaredto: RequestDto): Promise<any> {
  //   return await this.bdFareService.processApi(bdfaredto);
  // }
  @ApiBearerAuth('access_token')
  //@UseGuards(WhitelistGuard)
  //@UseGuards(RateLimiterGuard)
  @Post('/api2')
  async searchFlights(
    @Body() flightSearchModel: FlightSearchModel,
  ): Promise<any> {
    return this.bdFareService.airShopping(flightSearchModel);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('/api2/fareRules')
  async BfFareRules(@Body() data: searchResultDtobdf): Promise<any> {
    return this.bdFareService.fareRules(data);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('/api2/priceCheck')
  async BdfarePriceCheck(@Body() data: searchResultDtobdf): Promise<any> {
    return this.bdFareService.offerPrice(data);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('/api2MiniRule')
  async BdfareMiniRules(@Body() data: searchResultDtobdf): Promise<any> {
    return this.bdFareService.miniRule(data);
  }

  @Post('/sabre')
  search(@Body() flightdto: FlightSearchModel) {
    const sabre = this.sabreService.shoppingBranded(flightdto);
    // const BDFare = this.bdFareService.airShopping(flightdto);
    return sabre;
  }
  @Get('/:pnr')
  getpnr(@Param('pnr') pnr: string) {
    return this.sabreService.checkpnr(pnr);
  }
  @Get('/airVoid/:pnr')
  async airvoid(@Param('pnr') pnr: string) {
    return await this.sabreService.airvoid(pnr);
  }
  @Get('/ticket/:pnr')
  get_ticket(@Param('pnr') pnr: string) {
    return this.sabreService.get_ticket(pnr);
  }
  @Post('sbr/fairRules')
  airfarerules(@Body() fareRulesDto: FareRulesDto) {
    return this.sabreService.airfarerules(fareRulesDto);
  }
  @Get('/airRetrive/:pnr')
  airretrieve(@Param('pnr') pnr: string) {
    return this.sabreService.airretrieve(pnr);
  }
  @ApiBearerAuth('access_token')
  //@UseGuards(RateLimiterGuard)
  @Post('/api1/airSearch/')
  async convertToFlyAirSearchDto(
    @Body() flightSearchModel: FlightSearchModel,
    @Req() request: Request,
  ): Promise<any> {
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }

    return await this.flyHubService.convertToFlyAirSearchDto(
      flightSearchModel,
      userIp,
    );
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('/api1/priceCheck')
  async airPrice(@Body() data: searchResultDto) {
    return await this.flyHubService.airPrice(data);
  }

  @Post('/api1/farePolicyMiniRules')
  async miniRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.bookingRules(data);
  }
  @Post('/api1/fairRules')
  async airRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.airRules(data);
  }

  // @Post('apicheck')
  // async apicheck(
  //   @Body() SearchResponse: any,
  //   @Headers() header: Headers,
  //   @Param('fisId')fisId:string,
  // ): Promise<any> {
  //   const currentTimestamp = new Date();
  //   return await this.testservice.airRetriveDataTransformer(
  //     SearchResponse,
  //     fisId
  //   );
  // }
  // @Post('/test')
  // async apiCheck(@Body() data: dataAny) {
  //   return await this.testservice.saveBookingData(data);
  // }
}
