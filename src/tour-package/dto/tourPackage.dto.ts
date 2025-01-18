import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject, IsOptional } from 'class-validator';



class CreateTourPlanDto {
  @ApiProperty({ description: 'Title of the tour plan', default: '' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the tour plan', default: '' })
  @IsString()
  plan: string;
}

class CreateIntroductionDto {
  @ApiProperty({ description: 'Main title for the tour package', default: '' })
  @IsString()
  mainTitle: string;

  @ApiProperty({ description: 'Sub title for the tour package', default: '' })
  @IsString()
  subTitle: string;

  @ApiProperty({ description: 'Type of the trip (e.g., adventure, leisure)', default: '' })
  @IsString()
  tripType: string;

  @ApiProperty({ description: 'Journey duration (e.g., 5 days, 3 weeks)', default: '' })
  @IsString()
  journeyDuration: string;

  @ApiProperty({ description: 'Journey start date', default: '' })
  @IsString()
  journeyStartDate: string;

  @ApiProperty({ description: 'Journey end date', default: '' })
  @IsString()
  journeyEndDate: string;


  @ApiProperty({ description: 'Journey location (e.g., region)', default: '' })
  @IsString()
  journeyLocation: string[];

  @ApiProperty({ description: 'Total number of seats available for the tour', default: '0' })
  @IsString()
  totalSeat: string;

  @ApiProperty({ description: 'Minimum age for the tour', default: '0' })
  @IsString()
  minimumAge: string;

  @ApiProperty({ description: 'Maximum age for the tour', default: '0' })
  @IsString()
  maximumAge: string;

  @ApiProperty({ description: 'Price of the package', default: '' })
  @IsString()
  packagePrice: string;

  @ApiProperty({ description: 'Discount on the package (optional)', default: '' })
  @IsString()
  packageDiscount?: string;
}

export class CreateTourPackageDto {
  @ApiProperty({ description: 'Package status', default: 'active' })
  @IsString()
  status: string;

  @ApiProperty({ description: 'Package type', default: 'standard' })
  @IsString()
  packageType: string;

  @ApiProperty({
    description: 'Overview details of the package',
    default: { packageOverView: '', packageInclude: [] },
  })
  @IsObject()
  overView: {
    packageOverView: string;
    packageInclude: string[];
  };
  @ApiProperty({
    description: 'Tour plan details',
    default: {},
  })
  @IsObject()
  tourPlan: any;

  @ApiProperty({
    description: 'Objective details (inclusion, exclusion, booking & refund policies)',
    default: { inclusion: {}, exclusion: {}, bookingPolicy: {}, refundPolicy: {} },
  })
  @IsObject()
  objective: {
    inclusion: any;
    exclusion: any;
    bookingPolicy: any;
    refundPolicy: any;
  };

  @ApiProperty({
    description: 'Meta information for the package (SEO)',
    default: { metaTitle: '', metaKeyword: [], metadescription: '' },
  })
  @IsObject()
  metaInfo: {
    metaTitle: string;
    metaKeyword: string[];
    metadescription: string;
  };

  @ApiProperty({ description: 'Introduction information', type: CreateIntroductionDto })
  @IsOptional()
  introduction: CreateIntroductionDto;

  @ApiProperty({ description: 'Tour plans related to the package', type: [CreateTourPlanDto] })
  @IsOptional()
  tourPlans: CreateTourPlanDto[];
}







