import { IsString, IsNumber, IsArray, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DurationCostDto {
  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiProperty()
  @IsString()
  entry: string;

  @ApiProperty()
  @IsString()
  duration: string;

  @ApiProperty()
  @IsString()
  maximumStay: string;

  @ApiProperty()
  @IsString()
  processingTime: string;
}
export class VisaRequiredDocumentsDto {
  @ApiProperty()
  @IsString()
  profession: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  documents: any[]; // Adjust type if you have a specific structure

  @ApiProperty()
  @IsString()
  exceptionalCase: string;

  @ApiProperty()
  @IsString()
  note: string;
}
export class VisaAllDto {
  @ApiProperty()
  @IsString()
  departureCountry: string;

  @ApiProperty()
  @IsString()
  arrivalCountry: string;

  @ApiProperty()
  @IsString()
  visaCategory: string;

  @ApiProperty()
  @IsString()
  visaType: string;

  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiProperty({ type: [DurationCostDto], required: false })
  @IsOptional()
  @IsArray()
  durationCosts?: DurationCostDto[];

  @ApiProperty({ type: [VisaRequiredDocumentsDto], required: false })
  @IsOptional()
  @IsArray()
  visaRequiredDocuments?: VisaRequiredDocumentsDto[];
}



