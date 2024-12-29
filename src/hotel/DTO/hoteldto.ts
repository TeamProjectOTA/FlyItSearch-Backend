import { ApiProperty } from '@nestjs/swagger';

export class RefPointDto {
  @ApiProperty({ example: 'DWC' })
  Value: string;

  @ApiProperty({ example: 'CODE' })
  ValueContext: string;

  @ApiProperty({ example: '6' })
  RefPointType: string;
}

export class GeoRefDto {
  @ApiProperty({ example: 20 })
  Radius: number;

  @ApiProperty({ example: 'KM' })
  UOM: string;

  @ApiProperty()
  RefPoint: RefPointDto;
}

export class GeoSearchDto {
  @ApiProperty()
  GeoRef: GeoRefDto;
}

export class StayDateRangeDto {
  @ApiProperty({ example: '2025-01-28' })
  StartDate: string;

  @ApiProperty({ example: '2025-01-30' })
  EndDate: string;
}

export class RoomDto {
  @ApiProperty({ example: 1 })
  Index: number;

  @ApiProperty({ example: 1 })
  Adults: number;
}

export class RoomsDto {
  @ApiProperty({ type: [RoomDto] })
  Room: RoomDto[];
}

export class RateInfoRefDto {
  @ApiProperty({ example: false })
  ConvertedRateInfoOnly: boolean;

  @ApiProperty({ example: 'BDT' })
  CurrencyCode: string;

  @ApiProperty({ example: '2' })
  BestOnly: string;

  @ApiProperty({ example: 'IncludePrepaid' })
  PrepaidQualifier: string;

  @ApiProperty()
  StayDateRange: StayDateRangeDto;

  @ApiProperty()
  Rooms: RoomsDto;
}

export class SabreRatingDto {
  @ApiProperty({ example: '3' })
  Min: string;

  @ApiProperty({ example: '5' })
  Max: string;
}

export class HotelPrefDto {
  @ApiProperty()
  SabreRating: SabreRatingDto;
}

export class ImageRefDto {
  @ApiProperty({ example: 'ORIGINAL' })
  Type: string;

  @ApiProperty({ example: 'EN' })
  LanguageCode: string;
}

export class SearchCriteriaDto {
  @ApiProperty({ example: 1 })
  OffSet: number;

  @ApiProperty({ example: 'TotalRate' })
  SortBy: string;

  @ApiProperty({ example: 'ASC' })
  SortOrder: string;

  @ApiProperty({ example: 10 })
  PageSize: number;

  @ApiProperty({ example: false })
  TierLabels: boolean;

  @ApiProperty()
  GeoSearch: GeoSearchDto;

  @ApiProperty()
  RateInfoRef: RateInfoRefDto;

  @ApiProperty()
  HotelPref: HotelPrefDto;

  @ApiProperty()
  ImageRef: ImageRefDto;
}

export class GetHotelAvailRQDto {
  @ApiProperty()
  SearchCriteria: SearchCriteriaDto;
}

export class RootDto {
  @ApiProperty()
  GetHotelAvailRQ: GetHotelAvailRQDto;
}
