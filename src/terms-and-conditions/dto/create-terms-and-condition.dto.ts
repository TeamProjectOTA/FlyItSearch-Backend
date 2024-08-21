import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTermsAndConditionDto {
    @ApiProperty({default:"Data"})
    @IsString()
    text:string
}
