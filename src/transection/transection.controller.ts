import { Controller } from '@nestjs/common';
import { TransectionService } from './transection.service';

@Controller('transection')
export class TransectionController {
  constructor(private readonly transectionService: TransectionService) {}
}
