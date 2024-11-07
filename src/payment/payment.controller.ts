import {
  Controller,
  HttpStatus,
  Post,
  Res,
  HttpException,
  Body,
  Param,
  Req,
  Get,
  Query,
  NotFoundException,
  Headers,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('SSLCOMMERZ')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/success/:bookingId/:email')
  async handleSuccess(
    @Param('email') email: string,
    @Param('amount') amount: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { val_id } = req.body;
      const validationResponse = await this.paymentService.validateOrder(val_id, email, amount);
  
      if (validationResponse?.status === 'VALID') {
        return res.redirect(process.env.SUCCESS_CALLBACK);
      } else {
        return res.status(400).json({ message: 'Payment validation failed', validationResponse });
      }
    } catch (error) {
      console.error('Error during payment validation:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  @Post('/fail')
  async handleFail(@Res() res: Response) {
    
   return res.redirect(process.env.FAIELD_CALLBACK)
  }

  @Get('/cancel')
  async handleCancel(@Res() res: Response) {
    return res.redirect(process.env.FAIELD_CALLBACK)
  }

  @Post('/ipn')
  async handleIPN(@Req() req: Request, @Res() res: Response) {
    try {
      const ipnData = req.body;
      console.log('IPN Data:', ipnData);

      const response = await this.paymentService.validateOrder(ipnData.tran_id);
      if (response.status === 'VALID') {
        res.status(HttpStatus.OK).send('IPN received and processed');
      } else {
        res.status(HttpStatus.BAD_REQUEST).send('IPN validation failed');
      }
    } catch (error) {
      console.error('Error handling IPN:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('IPN processing failed');
    }
  }

  @Get('callback/:bookingId/:email')
  async handlePaymentCallback(
    @Param('bookingId') bookingId: string,
    @Param('email') email: string,
    @Query('paymentID') paymentID: string,
    @Query('status') status: string,
    @Query('signature') signature: string,
    @Res() res: Response,
  ) {
    const result = await this.paymentService.executePaymentBkash(
      paymentID,
      status,
      bookingId,
      res,
      email,
    );
    return result;
  }

  @Get('return/:bookingID/:email')
  async paymentReturn(
    @Param('bookingID') bookingID: string,
    @Param('email') email: string,
    @Query('order_id') order_id: string,
    @Res() res: Response,
    
  ) {
    const paymentData = await this.paymentService.surjoVerifyPayment(
      order_id,
      bookingID,
      email,
      res
    );
    return {
      message: 'Payment successfull',
      data: paymentData,
    };
  }

  @ApiBearerAuth('access_token')
  @Post('bkashCreate/:amount/:bookingId')
  async createPayment(
    @Param('amount') amount: number,
    @Headers() header: Headers,
    @Param('bookingId') bookingId: string,
  ) {
    return this.paymentService.createPaymentBkash(amount, bookingId, header);
  }
  @Post('query/:paymentId')
  async queryPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.queryPayment(paymentId);
  }

  @Post('search/:transactionId')
  async searchTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.searchTransaction(transactionId);
  }

  @Post('refund/:paymentId/:amount/:trxID')
  async refundTransaction(
    @Param('paymentId') paymentId: string,
    @Param('trxID') trxID: string,
    @Param('amount') amount: number,
  ) {
    return this.paymentService.refundTransaction(paymentId, amount,trxID);
  }
 @Get('auth/surjo')
 async surjotest(){
  return this.paymentService.surjoAuthentication()
 }
}
