import { Controller, Get } from "@nestjs/common";

@Controller()
export class rootController {
    @Get()
    async test(){
        return ' Welcome to flyItsearch api '
    }
}