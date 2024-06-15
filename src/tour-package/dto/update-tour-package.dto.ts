import { PartialType } from '@nestjs/swagger';
import { CreateTourPackageDto } from './create-tour-package.dto';

export class UpdateTourPackageDto extends PartialType(CreateTourPackageDto) {}
