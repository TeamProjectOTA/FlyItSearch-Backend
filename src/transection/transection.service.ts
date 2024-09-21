import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { BookingSave } from "src/book/booking.model";
import { Repository } from "typeorm";

@Injectable()
export class TransectionService{
    constructor(private readonly authService:AuthService,
        @InjectRepository(BookingSave)
        private readonly bookingRepository:Repository<BookingSave>){}
    async paymentWithWallet(header:any,bookingId:string){
    const email = await this.authService.decodeToken(header);
    console.log(email,bookingId)
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    const tran_id = `SSM${timestamp}${randomNumber}`;

    
    }
}