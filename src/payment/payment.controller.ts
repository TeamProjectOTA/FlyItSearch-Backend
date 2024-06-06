import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express'; // Needed for response redirection
import { ApiTags } from '@nestjs/swagger';
@ApiTags('SSLCOMMERZ')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:passengerId')
  async getPaymentUrl(
    @Req() res: Response,
    @Param('passengerId') passengerId: string,
  ) {
    try {
      const redirectUrl =
        await this.paymentService.initiatePayment(passengerId);
      return { url: redirectUrl, statusCode: 301 };
    } catch (error) {
      return { message: 'Failed to initiate payment' };
    }
  }
  @Get('/payment/validate/')
  async validateOrder(@Query('val_id') val_id: string) {
    try {
      const response = await this.paymentService.validateOrder(val_id);
      return { data: response };
    } catch (error) {
      return { message: 'Failed to validate order' };
    }
  }

  @Post('/success')
  // @HttpCode(HttpStatus.MOVED_PERMANENTLY) // Redirect with appropriate status code
  redirectSuccess(@Res() res: Response) {
    //const redirectUrl=res.redirect(`${process.env.CLIENT_ROOT}/paymentSuccessful`)
    const successMessage = 'The payment was successful.';
    res.status(HttpStatus.OK).send(successMessage);
  }

  @Post('/fail')
  //@HttpCode(HttpStatus.MOVED_PERMANENTLY)
  redirectFail(@Res() res: Response) {
    //const redirectUrl=res.redirect(`${process.env.CLIENT_ROOT}/paymentFailure`)
    const message = ' The payment was not done';
    res.status(HttpStatus.OK).send(message);
  }

  @Post('/cancel')
  //@HttpCode(HttpStatus.MOVED_PERMANENTLY)
  redirectCancel(@Res() res: Response) {
    //const redirectUrl=res.redirect(`${process.env.CLIENT_ROOT}/paymentFailure`)
    const message = 'The payment was canceled';
    res.status(HttpStatus.OK).send(message);
  }
}
