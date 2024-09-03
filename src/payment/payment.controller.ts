import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  HttpException,
  Body,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SSLCOMMERZ')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('/sslccommerz')
  async getPaymentUrl(@Res() res: Response, @Body() paymentData: any) {
    try {
      const redirectUrl =
        await this.paymentService.initiatePayment(paymentData);
      res.status(HttpStatus.OK).json({ url: redirectUrl });
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw new HttpException(
        'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Post('/success/:val_id')
  async handleSuccess(@Param('val_id') val_id: string, @Res() res: Response) {
   // console.log(val_id)
    try {
      const response = await this.paymentService.validateOrder(val_id);
      if (response.status === 'VALID') {
        res.status(HttpStatus.OK).json({
          message: 'Payment was successful.',
          details: response,
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Payment validation failed.',
          details: response,
        });
      }
    } catch (error) {
      console.error('Error handling success:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to validate payment.',
        error: error.message,
      });
    }
  }

  @Post('/fail')
  handleFail(@Res() res: Response) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Payment failed.',
    });
  }

  @Post('/cancel')
  handleCancel(@Res() res: Response) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Payment was cancelled.',
    });
  }
}
