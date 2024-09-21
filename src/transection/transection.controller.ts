import { Controller, Post } from "@nestjs/common";
import { TransectionService } from "./transection.service";

@Controller('WalletTransection')
export class TransectionController{
    constructor(private readonly TranserctionService:TransectionService){
        
    }
    @Post('Wallet')
    async walletTransection(){}
}