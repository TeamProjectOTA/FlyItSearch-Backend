import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { FlightService } from './flight.service';
import { Flight, FlightSearchModel } from './flight.model';
import { ApiTags } from '@nestjs/swagger';
import { SabreService } from './sabre.flights.service';
import { FareRulesDto } from './dto/fare-rules.flight.dto';

@ApiTags('Flight-filters')
@Controller('flights')
export class FlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly sabreService: SabreService,
  ) {}

  @Post()
  search(@Body() flightdto: FlightSearchModel) {
    return this.sabreService.shoppingBranded(flightdto);
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
