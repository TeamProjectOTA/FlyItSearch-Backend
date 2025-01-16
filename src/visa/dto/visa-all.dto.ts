import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DurationCostDto {
  @ApiProperty({
    description: 'The cost for a specific duration of the visa',
    example: 1500,
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    description: 'The entry method for the visa application (e.g., consulate, embassy, etc.)',
    example: 'Consulate',
  })
  @IsString()
  entry: string;

  @ApiProperty({
    description: 'The duration of stay allowed under this visa (e.g., 30 days, 90 days)',
    example: '30 days',
  })
  @IsString()
  duration: string;

  @ApiProperty({
    description: 'The maximum stay period permitted under this visa',
    example: '90 days',
  })
  @IsString()
  maximumStay: string;

  @ApiProperty({
    description: 'The processing time required for visa approval',
    example: '10 business days',
  })
  @IsString()
  processingTime: string;

  @ApiProperty({
    description: 'Interview requirements (e.g., mandatory, optional)',
    example: 'Mandatory',
  })
  @IsString()
  interview: string;

  @ApiProperty({
    description: 'Embassy fees associated with processing the visa application',
    example: '100 USD',
  })
  @IsString()
  embassyFee: string;

  @ApiProperty({
    description: 'Agent fees associated with facilitating the visa process',
    example: '50 USD',
  })
  @IsString()
  agentFee: string;

  @ApiProperty({
    description: 'Service charges applicable during visa processing',
    example: '20 USD',
  })
  @IsString()
  serviceCharge: string;

  @ApiProperty({
    description: 'Processing fees for handling the application',
    example: '30 USD',
  })
  @IsString()
  processingFee: string;
}

export class VisaRequiredDocumentsDto {
  @ApiProperty({
    description: 'The profession for which the visa is required',
    example: 'Software Engineer',
  })
  @IsString()
  profession: string;

  @ApiProperty({
    description: 'A list of documents required for the visa application',
    example:"Required document"
  })
  @IsArray()
  documents: any;

  @ApiProperty({
    description: 'Any exceptional case conditions for specific document requirements',
    example: 'If the applicant has no recent work experience, they may submit a self-declaration letter.',
  })
  @IsString()
  exceptionalCase: string;

  @ApiProperty({
    description: 'Additional notes about the documents or application process',
    example: 'Documents must be in English or translated to English.',
  })
  @IsString()
  note: string;
}


export class VisaAllDto {
  @ApiProperty({
    description: 'The country from which the visa applicant is departing',
    example: 'India',
  })
  @IsString()
  departureCountry: string;

  @ApiProperty({
    description: 'The country the visa applicant intends to travel to',
    example: 'United States',
  })
  @IsString()
  arrivalCountry: string;

  @ApiProperty({
    description: 'The category of the visa (e.g., work, tourist, student)',
    example: 'Tourist',
  })
  @IsString()
  visaCategory: string;

  @ApiProperty({
    description: 'The type of visa (e.g., single-entry, multiple-entry)',
    example: 'Single-entry',
  })
  @IsString()
  visaType: string;

  @ApiProperty({
    description: 'The cost associated with obtaining the visa',
    example: 200,
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    description: 'Duration cost details (e.g., cost for different durations)',
    type: [DurationCostDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  durationCosts?: DurationCostDto[];

  @ApiProperty({
    description: 'The required documents for the visa',
    type: VisaRequiredDocumentsDto,
    required: false,
  })
  @IsOptional()
  visaRequiredDocuments?: VisaRequiredDocumentsDto;
}
