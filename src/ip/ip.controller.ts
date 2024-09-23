import { Controller, Param, Patch } from "@nestjs/common";
import { IpService } from "./ip.service";

@Controller('SearchCount')
export class IpController{
    constructor(private readonly ipService:IpService){
    }
    
    @Patch('admin/updatelimit/:email/:points')
    async searchCount(@Param('email') email:string, @Param('points') points:number){
        return await this.ipService.update(email,points)

    }

}