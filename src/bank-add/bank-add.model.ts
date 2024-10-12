import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class BankAdd{
@PrimaryGeneratedColumn()
id:number
@Column()
accountHolderName:string
@Column()
bankName:string
@Column()
accountNumber:string
@Column()
address:string
@Column()
branchName:string
@Column()
routingNumber:string
@Column()
swiftCode:string
}

export class CreateBankAddDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountHolderName: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankName: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountNumber: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    address:string
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    branchName: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    routingNumber: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    swiftCode: string;
}