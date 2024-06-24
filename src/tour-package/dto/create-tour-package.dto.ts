import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BookingPolicy, Exclusion, Inclusion, RefundPolicy, TravelPackageInclusionDto, TripType } from './types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntroductionDto {
  @IsString()
  @IsNotEmpty()
  mainTitle: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @IsString()
  @IsNotEmpty()
  tripType: string;

  @IsString()
  @IsNotEmpty()
  journeyDuration: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  countryName: string;

  @IsString()
  @IsNotEmpty()
  cityName: string;

  @IsString()
  @IsNotEmpty()
  journeyLocation: string;

  @IsNumber()
  @IsNotEmpty()
  totalSeat: number;

  @IsNumber()
  maximumAge: number;

  @IsNumber()
  minimumAge: number;

  @IsNumber()
  packagePrice: number;

  @IsNumber()
  packageDiscount: number;
}

export class CreateOverviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default:
      'This package includes an exciting tour of the city with various activities.',
  })
  packageOverview: string;

  @ApiProperty({ type: TravelPackageInclusionDto })
  packageInclude: TravelPackageInclusionDto[];
}

export class CreateMainImageDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  size: number;
  @IsString()
  @IsNotEmpty()
  mainTitle: string;
}

export class CreateVisitPlaceDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  size: number;
  @IsString()
  @IsNotEmpty()
  pictureName: string;
}

export class CreateTourPlanDto {
  @IsString()
  @IsNotEmpty()
  tourPlanTitle: string;

  @IsString()
  @IsNotEmpty()
  dayPlan: string;
}

export class CreateObjectivesDto {
  @ApiProperty({ type: Inclusion })
  inclusion:Inclusion[]
  @ApiProperty({ type: Exclusion })
  exclusion:Exclusion[]
  @ApiProperty({ type: BookingPolicy })
  bookingPolicy:BookingPolicy[]
  @ApiProperty({ type: RefundPolicy })
  refundPolicy:RefundPolicy[]
}

export class CreateMetaInfoDto {
  @IsString()
  @IsNotEmpty()
  metaTitle: string;

  @IsArray()
  metaKeywords: TripType[];

  @IsString()
  @IsNotEmpty()
  metaDescription: string;
}

export class CreateTourPackageDto {
  @ValidateNested()
  @ApiProperty({ type: CreateIntroductionDto })
  @Type(() => CreateIntroductionDto)
  introduction: CreateIntroductionDto;

  @ValidateNested()
  @ApiProperty({ type: CreateOverviewDto })
  @Type(() => CreateOverviewDto)
  overview: CreateOverviewDto;

  @ApiProperty({ type: CreateMainImageDto })
  @ValidateNested({ each: true })
  @Type(() => CreateMainImageDto)
  mainImage: CreateMainImageDto[];

@ApiProperty({ type: CreateVisitPlaceDto })
  @ValidateNested({ each: true })
  @Type(() => CreateVisitPlaceDto)
  visitPlace: CreateVisitPlaceDto[];

  @ApiProperty({ type: CreateTourPlanDto })
  @ValidateNested({ each: true })
  @Type(() => CreateTourPlanDto)
  tourPlan: CreateTourPlanDto[];


@ApiProperty({ type: CreateObjectivesDto })
  @ValidateNested({ each: true })
  @Type(() => CreateObjectivesDto)
  objectives: CreateObjectivesDto[];

@ApiProperty({ type: CreateMetaInfoDto })
  @ValidateNested()
  @Type(() => CreateMetaInfoDto)
  metaInfo: CreateMetaInfoDto;
}
