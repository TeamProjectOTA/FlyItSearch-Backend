import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class vendorTicket{
    @ApiProperty()
    @IsString()
    bookingId:string
    @ApiProperty()
    @IsString()
    airlinesPNR:string
    @ApiProperty()
    @IsNumber()
    vendorAmount:number
    @ApiProperty()
    profit:number
    @ApiProperty()
    vendorName:string
    @ApiProperty()
    segmentCount:string
    @ApiProperty()
    ticketNumber:[{index:number,eticket:number}]
}


@Entity()
export class NewTicket{
@PrimaryGeneratedColumn()
id:number
@Column({nullable:true})
gdsPNR:string
@Column()
bookingId:string
@Column()
airlinesPNR:string
@Column()
vendorName:string
@Column()
loss_profit:string
@Column({nullable:true})
segmentCount:string
@Column({nullable:true})
flyHubPNR:string
@Column({nullable:true})
dealAmount:number
@Column({nullable:true})
inVoiceAmount:number
@Column('json', { nullable: true })
ticket:any
}