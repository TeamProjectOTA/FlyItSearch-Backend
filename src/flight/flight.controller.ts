import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, FlightSearchModel, } from './flight.model';
import { ApiTags } from '@nestjs/swagger';
import { SabreService } from './sabre.flights.service';
import { FareRulesDto } from './dto/fare-rules.flight.dto';
import {  BDFareService } from './bdfare.flights.service';
import { RequestDto } from './bdfare.model';


@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly sabreService: SabreService,
    private readonly bdFareService:BDFareService
  ) {}


  @Post('/bdfare')
  async getApiResponse(@Body()bdfaredto:RequestDto): Promise<any> {
    return await this.bdFareService.processApi(bdfaredto);
  }

  @Post('/bdfareupdate')
  async searchFlights(@Body() flightSearchModel: FlightSearchModel): Promise<any> {
    return this.bdFareService.processApi2(flightSearchModel);
  }

  @Post()
  search(@Body() flightdto: FlightSearchModel) {
    const sabre=this.sabreService.shoppingBranded(flightdto);
    const BDFare=this.bdFareService.airShopping(flightdto)
    return {
      
      BdFare:BDFare
    }
  }
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
  @Post('/fair-rules')
  airfarerules(@Body() fareRulesDto: FareRulesDto) {
    return this.sabreService.airfarerules(fareRulesDto);
  }
  @Get('/airretrive/:pnr')
  airretrieve(@Param('pnr') pnr: string) {
    return this.sabreService.airretrieve(pnr);
  }

  // @Post('filter')
  // async filterFlights(@Body() filter: flightModel): Promise<Flight[]> {
  //   return await this.flightService.filterFlights(filter);
  // }
}
