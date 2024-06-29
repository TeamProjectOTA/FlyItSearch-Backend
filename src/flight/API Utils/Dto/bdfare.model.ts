import { ApiProperty } from '@nestjs/swagger';

export class OriginDepRequestDto {
  @ApiProperty({ default: 'DAC' })
  iatA_LocationCode: string;
  @ApiProperty({ default: '2024-07-25' })
  date: string;
}

export class DestArrivalRequestDto {
  @ApiProperty({ default: 'DXB' })
  iatA_LocationCode: string;
}

export class OriginDestDto {
  @ApiProperty({ type: OriginDepRequestDto })
  originDepRequest: OriginDepRequestDto;
  @ApiProperty({ type: DestArrivalRequestDto })
  destArrivalRequest: DestArrivalRequestDto;
}

export class PaxDto {
  @ApiProperty({ default: 'PAX1' })
  paxID: string;
  @ApiProperty({ default: 'ADT' })
  ptc: string;
}

export class TravelPreferencesDto {
  @ApiProperty({ default: 'Economy' })
  cabinCode: string;
}

export class ShoppingCriteriaDto {
  @ApiProperty({ default: '1' })
  tripType: string;
  @ApiProperty({ type: TravelPreferencesDto })
  travelPreferences: TravelPreferencesDto;
  @ApiProperty({ default: true })
  returnUPSellInfo: boolean;
}

export class RequestInnerDto {
  @ApiProperty({ type: [OriginDestDto] })
  originDest: OriginDestDto[];

  @ApiProperty({ type: [PaxDto] })
  pax: PaxDto[];

  @ApiProperty({ type: ShoppingCriteriaDto })
  shoppingCriteria: ShoppingCriteriaDto;
}

export class RequestDto {
  @ApiProperty({ default: 'BD' })
  pointOfSale: string;

  @ApiProperty({ type: RequestInnerDto })
  request: RequestInnerDto;
}
