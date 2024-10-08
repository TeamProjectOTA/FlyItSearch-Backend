import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
  Patch,
  Param,
  Req,
  Res,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  InternalServerErrorException,
} from '@nestjs/common';
import { DepositService } from './deposit.service';
import { Deposit } from './deposit.model';
import { UserTokenGuard } from 'src/auth/user-tokens.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdmintokenGuard } from 'src/auth/admin.tokens.guard';
import { Response, Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Deposit Api')
@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

@Post('/createDeposit')
@UseGuards(UserTokenGuard)
@UseInterceptors(
  FileInterceptor('receiptImage', {  // Ensure this matches your form data field name
    storage: memoryStorage(),        // Storing in memory
    limits: { fileSize: 5 * 1024 * 1024 },  // Limiting file size to 5MB
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('File type must be jpeg, jpg, png, gif'), false);
      }
    },
  }),
)
async createDeposit(
  @UploadedFile() file: Express.Multer.File,
  @Body() depositData: Partial<Deposit>,
  @Headers() header: any,
): Promise<Deposit> { 

  if (!file) {
    throw new BadRequestException('Receipt image is required');
  }
  try {
    return await this.depositService.createDeposit(depositData, header, file);
  } catch (error) {
    console.error('Error in createDeposit:', error.message);  
    throw new InternalServerErrorException('Failed to create deposit');
  }
}

  
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('user/findAll')
  async findAllDepositForUser(@Headers() header: any) {
    return this.depositService.getDepositforUser(header);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(AdmintokenGuard)
  @Get('admin/findAll')
  async findAllDepositForAdmin() {
    return this.depositService.findAllDeposit();
  }
  @Patch('/admin/depositAction/:depositId')
  @UseGuards(AdmintokenGuard)
  async actionOnDeposit(
    @Body() updateData: { status: string; rejectionReason: string },
    @Param('depositId') depositId: string,
  ) {
    return this.depositService.updateDepositStatus(depositId, updateData);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Get('user/wallet')
  async wallet(@Headers() header: any) {
    return await this.depositService.wallet(header);
  }
  @ApiBearerAuth('access_token')
  @UseGuards(UserTokenGuard)
  @Post('sslcommerz/deposit')
  async sslcommerz(@Headers() header:any,@Body('ammount') ammount:number){
    return await this.depositService.sslcommerzPaymentInit(header,ammount)
  }
  @Post('/success/:email/:amount')
  async depositSuccess(
    @Param('email') email:string,
    @Param('amount') amount:number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const { val_id } = req.body;  
      const validationResponse = await this.depositService.validateOrder(val_id,email,amount);
      if (validationResponse?.status === 'VALID') {
      
        return res.status(200).json({ message: 'Payment successful', validationResponse });
      } else {
       
        //console.error('Payment validation failed:', validationResponse);
        return res.status(400).json({ message: 'Payment validation failed', validationResponse });
      }
    } catch (error) {
      
      console.error('Error during payment validation:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
  
}
