import { Controller, Post, Body, Param, Get, Req } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, FlightSearchModel } from './flight.model';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto } from './API Utils/Dto/bdfare.model';
import { searchResultDto } from './API Utils/Dto/flyhub.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';
import { Test } from './API Utils/test.service';
import { BookingID } from 'src/book/book.model';

@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(
    private readonly sabreService: SabreService,
    private readonly bdFareService: BDFareService,
    private readonly flyHubService: FlyHubService,
    private readonly testservice: Test,
  ) {}

  // @Post('/flyhub')
  // async searchFlightsFlyhub(@Body() airSearchDto: FlyAirSearchDto) {
  //   const result = await this.flyHubService.searchFlights(airSearchDto);
  //   return result;
  // }

  @Post('/bdfare')
  async getApiResponse(@Body() bdfaredto: RequestDto): Promise<any> {
    return await this.bdFareService.processApi(bdfaredto);
  }

  @Post('/bdfareupdate')
  async searchFlights(
    @Body() flightSearchModel: FlightSearchModel,
  ): Promise<any> {
    return this.bdFareService.airShopping(flightSearchModel);
  }

  // @Post()
  // search(@Body() flightdto: FlightSearchModel) {
  //   const sabre = this.sabreService.shoppingBranded(flightdto);
  //   const BDFare = this.bdFareService.airShopping(flightdto);
  //   return {
  //     BdFare: BDFare,
  //   };
  // }
  @Get('/:pnr')
  getpnr(@Param('pnr') pnr: string) {
    return this.sabreService.checkpnr(pnr);
  }
  @Get('/airvoid/:pnr')
  airvoid(@Param('pnr') pnr: string) {
    return this.sabreService.airvoid(pnr);
  }
  @Get('/ticket/:pnr')
  get_ticket(@Param('pnr') pnr: string) {
    return this.sabreService.get_ticket(pnr);
  }
  @Post('sbr/fair-rules')
  airfarerules(@Body() fareRulesDto: FareRulesDto) {
    return this.sabreService.airfarerules(fareRulesDto);
  }
  @Get('/airretrive/:pnr')
  airretrieve(@Param('pnr') pnr: string) {
    return this.sabreService.airretrieve(pnr);
  }

  @Post('fhb/air-search/:uuid')
  async convertToFlyAirSearchDto(
    @Body() flightSearchModel: FlightSearchModel,
    @Param('uuid')uuid: string,
    @Req() request: Request
  ): Promise<any> {
    let userIp = request.ip;
    if (userIp.startsWith('::ffff:')) {
      userIp = userIp.split(':').pop();
    }

    return this.flyHubService.convertToFlyAirSearchDto(flightSearchModel,userIp,uuid);
  }

  @Post('flh/price-check')
  async airPrice(@Body() data: searchResultDto) {
    return await this.flyHubService.airPrice(data);
  }

  @Post('flh/booking-policy')
  async miniRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.bookingRules(data);
  }
  @Post('flh/air-rules')
  async airRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.airRules(data);
  }


 
}
