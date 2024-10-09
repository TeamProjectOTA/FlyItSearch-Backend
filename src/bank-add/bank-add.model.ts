import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsString } from 'class-validator';

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
branchName:string
@Column()
routingNumber:string
@Column()
swiftCode:string
}

export class CreateBankAddDto {
    @IsNotEmpty()
    @IsString()
    accountHolderName: string;

    @IsNotEmpty()
    @IsString()
    bankName: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    branchName: string;

    @IsNotEmpty()
    @IsString()
    routingNumber: string;

    @IsNotEmpty()
    @IsString()
    swiftCode: string;
}