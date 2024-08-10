import {
  Controller,
  Param,
  Post,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { sendEmaildto } from './mail.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Admin } from 'src/admin/entities/admin.entity';

@ApiTags('Email')
@Controller('mail')
export class MailController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly mailsevice: MailService,
    private readonly jwtservice: JwtService,
  ) {}

  @ApiBearerAuth('access_token')
  @Post('/send-email/:passengerId')
  async sendMail(
    @Param('passengerId') passengerId: string,
    @Headers() header: Headers,
  ) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: { passengerId: passengerId },
      });

      const token = header['authorization'].replace('Bearer ', '');
      const decodedToken = await this.jwtservice.verifyAsync(token);
      const adminId = decodedToken.sub;
      const emailData = await this.adminRepository.findOne({
        where: { uuid: adminId },
      });
      const dto: sendEmaildto = {
        from: {
          name: emailData.firstName + emailData.lastName,
          address: emailData.email,
        },
        recipeants: [
          {
            name: `${user.fullName} `,
            address: user.email,
          },
        ],
        subject: 'Information',
        html: `<h1>Hi ${user.fullName} !<h1><br>This email is forward to you confirming that you have booked a ticket with the booking id of `,
      };

      await this.mailsevice.sendMail(dto, header);

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'Error sending email, Login again and try again',
      };
    }
  }
  
}
