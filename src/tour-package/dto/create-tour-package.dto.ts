// create-introduction.dto.ts
import {  IsArray, IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { TravelPackageInclusionDto, TripType } from './types';

export class CreateIntroductionDto {
  @IsString()
  @IsNotEmpty()
  mainTitle: string;

  @IsString()
  @IsNotEmpty()
  subTitle: string;

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

  @IsString()
  @IsNotEmpty()
  totalSeat: string;

  @IsNumber()
  maximumAge: number;

  @IsNumber()
  minimumAge: number;

  @IsDecimal()
  packagePrice: number;

  @IsDecimal()
  packageDiscount: number;

  @IsString()
  @IsNotEmpty()
  packageOverview: string;
}


export class CreateOverviewDto {
  @IsString()
  @IsNotEmpty()
  packageOverview: string;

  @IsArray()
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
  description: string;

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
  placeName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  mainTitle: string;
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
  @IsString()
  @IsNotEmpty()
  objective: string;
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
  @Type(() => CreateIntroductionDto)
  introduction: CreateIntroductionDto;

  @ValidateNested()
  @Type(() => CreateOverviewDto)
  overview: CreateOverviewDto;

  @ValidateNested({ each: true })
  @Type(() => CreateMainImageDto)
  mainImage: CreateMainImageDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateVisitPlaceDto)
  visitPlace: CreateVisitPlaceDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateTourPlanDto)
  tourPlan: CreateTourPlanDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateObjectivesDto)
  objectives: CreateObjectivesDto[];

  @ValidateNested()
  @Type(() => CreateMetaInfoDto)
  metaInfo: CreateMetaInfoDto;
}
