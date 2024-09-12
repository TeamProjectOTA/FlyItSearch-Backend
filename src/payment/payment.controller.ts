import {
  Controller,
  HttpStatus,
  Post,
  Res,
  HttpException,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

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
        email
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

  @Post('/cancel')
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
}
