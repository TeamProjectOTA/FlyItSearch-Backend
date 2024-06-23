import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('SSLCOMMERZ')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:passengerId')
  async getPaymentUrl(
    @Res() res: Response,
    @Param('passengerId') passengerId: string,
  ) {
    try {
      const redirectUrl =
        await this.paymentService.initiatePayment(passengerId);
      res.status(HttpStatus.OK).json({ url: redirectUrl });
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw new HttpException(
        'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/payment/validate')
  async validateOrder(@Query('val_id') val_id: string) {
    try {
      const response = await this.paymentService.validateOrder(val_id);
      return { data: response };
    } catch (error) {
      console.error('Failed to validate order:', error);
      throw new HttpException(
        'Failed to validate order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/success')
  async handleSuccess(@Query('val_id') val_id: string, @Res() res: Response) {
    try {
      const response = await this.paymentService.validateOrder(val_id);
      const successMessage = {
        message: 'The payment was successful.',
        data: response,
        status: HttpStatus.OK,
      };
      res.status(HttpStatus.OK).json(successMessage);
    } catch (error) {
      console.error('Success handling error:', error);
      throw new HttpException(
        'Failed to validate order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/fail')
  handleFail(@Res() res: Response) {
    const failMessage = {
      message: 'The payment was not successful.',
      status: HttpStatus.OK,
    };
    res.status(HttpStatus.OK).json(failMessage);
  }

  @Post('/cancel')
  handleCancel(@Res() res: Response) {
    const cancelMessage = {
      message: 'The payment was canceled.',
      status: HttpStatus.OK,
    };
    res.status(HttpStatus.OK).json(cancelMessage);
  }
}
