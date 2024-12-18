import { Body, Controller, Get, Post } from '@nestjs/common';
import { WhitelistService } from './whitelist';
import { IPWhitelistDTO } from './whitelist.model';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Whitelistapi')
@Controller('whitelist')
export class WhitelistController {
    constructor(private readonly whitelistService:WhitelistService){}
    
    @Get('/findAll')
    async findAll(){
        return await this.whitelistService.findAll()
    }

    @Post('/save')
    async saveData(@Body() ipWhitelistDTO:IPWhitelistDTO){
        return await this.whitelistService.save(ipWhitelistDTO)
    }

}
