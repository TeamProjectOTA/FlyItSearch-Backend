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
  Headers
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
    @Param('bookingId') bookingId: string,
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { val_id } = req.body;
      const response = await this.paymentService.validateOrder(
        val_id,
        bookingId,
        email,
      );
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

  @Get('/cancel')
  handleCancel(@Res() res: Response) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Payment was cancelled.',
    });
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
    @Param('bookingId') bookingId:string,
    @Param('email') email:string,
    @Query('paymentID') paymentID: string, 
    @Query('status') status: string, 
    @Query('signature') signature: string,
    @Res() res: Response
  ) {
    
        const result = await this.paymentService.executePaymentBkash(paymentID, status,bookingId,res,email);
       return result
      
  }
 
  // @Get('suth')
  // async test() {
  //   return this.paymentService.surjoAuthentication();
  // }

  @Get('return/:bookingID/:email')
  async paymentReturn(
    @Param('bookingID') bookingID: string,
    @Param('email') email: string,
    @Query('order_id') order_id: string,
  ) {
    const paymentData = await this.paymentService.surjoVerifyPayment(
      order_id,
      bookingID,
      email,
    );
    return {
      message: 'Payment successfull',
      data: paymentData,
    };
  }


  @ApiBearerAuth('access_token')
  @Post('bkashCreate/:amount/:bookingId')
  async createPayment( @Param('amount') amount: number, @Headers() header: Headers,@Param('bookingId') bookingId:string) {

    return this.paymentService.createPaymentBkash(amount,bookingId,header);
  }


  @Post('query/:paymentId')
  async queryPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.queryPayment(paymentId);
  }

  @Post('search/:transactionId')
  async searchTransaction(@Param('transactionId') transactionId: string) {
    return this.paymentService.searchTransaction(transactionId);
  }

  @Post('refund')
  async refundTransaction(
    @Body('paymentId') paymentId: string,
    @Body('amount') amount: number,
  ) {
    return this.paymentService.refundTransaction(paymentId, amount);
  }
}
