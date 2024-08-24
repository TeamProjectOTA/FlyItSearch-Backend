import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  HttpException,
  Body,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  // @Get('/validate')
  // async validateOrder(
  //   @Query('val_id') val_id: string,
  //   @Res() res: Response
  // ) {
  //   try {
  //     const response = await this.paymentService.validateOrder(val_id);
  //     res.status(HttpStatus.OK).json({ data: response });
  //   } catch (error) {
  //     console.error('Failed to validate order:', error);
  //     throw new HttpException('Failed to validate order', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Post('/success')
  async handleSuccess(@Query('val_id') val_id: string, @Res() res: Response) {
    try {
      //const response = await this.paymentService.validateOrder(val_id);
      res.status(HttpStatus.OK).json({
        message: 'The payment was successful.',
        status: HttpStatus.OK,
      });
    } catch (error) {
      console.error('Error handling success:', error);
      throw new HttpException(
        'Failed to validate order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/fail')
  handleFail(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      message: 'The payment was not successful.',
      status: HttpStatus.OK,
    });
  }

  @Post('/cancel')
  handleCancel(@Res() res: Response) {
    res.status(HttpStatus.OK).json({
      message: 'The payment was canceled.',
      status: HttpStatus.OK,
    });
  }
}
