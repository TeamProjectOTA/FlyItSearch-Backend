import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export class CreateTransectionDTO{}


Entity()
export class Transection{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    tranId:string
    @Column()
    tranDate:string
    @Column()
    paidAmount:string
    @Column()
    offerAmmount:string
    @Column()
    bankTranId:string
    @Column()
    riskTitle:string
    @Column()
    cardType:string
    @Column()
    cardIssuer:string
    @Column()
    cardBrand:string
    @Column()
    cardIssuerCountry:string
    @Column()
    validationDate:string
    

}