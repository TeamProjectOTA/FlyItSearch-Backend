import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, FlightSearchModel } from './flight.model';
import { ApiTags } from '@nestjs/swagger';

import { BookingID, FareRulesDto } from './dto/fare-rules.flight.dto';
import { SabreService } from './API Utils/sabre.flights.service';
import { BDFareService } from './API Utils/bdfare.flights.service';
import { RequestDto } from './API Utils/Dto/bdfare.model';
import { searchResultDto } from './API Utils/Dto/flyhub.model';
import { FlyHubService } from './API Utils/flyhub.flight.service';
import { Test } from './API Utils/test.service';

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

  @Post('fhb/air-search')
  async convertToFlyAirSearchDto(
    @Body() flightSearchModel: FlightSearchModel,
  ): Promise<any> {
    return this.flyHubService.convertToFlyAirSearchDto(flightSearchModel);
  }
  @Post('flh/airRetrive')
  async airRetrive(@Body() bookingIdDto: BookingID): Promise<any> {
    return await this.flyHubService.airRetrive(bookingIdDto);
  }
  @Post('flh/air-book')
  async aircancel(@Body() data: any) {
    return this.flyHubService.airbook(data);
  }

  @Post('flh/cancel-ticket')
  async aircanel(@Body() bookingIdDto: BookingID): Promise<any> {
    return this.flyHubService.aircancel(bookingIdDto);
  }

  @Post('flh/price-check')
  test(@Body() data: searchResultDto) {
    return this.flyHubService.airPrice(data);
  }

  @Post('flh/bookingPolicy')
  async miniRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.bookingRules(data);
  }
  @Post('flh/airRules')
  async airRules(@Body() data: searchResultDto): Promise<any> {
    return await this.flyHubService.airRules(data);
  }
}
