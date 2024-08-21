import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TermsAndCondition {
@PrimaryGeneratedColumn()
id:number
@Column({type:'text'})
text:string
}
