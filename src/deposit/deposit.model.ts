import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  depositType: string; // cash,cheque,bankDeposit,banktransfer
  @Column()
  depositId: string;
  @Column({ nullable: true })
  branch: string;
  @Column({ nullable: true })
  senderName: string;
  @Column({ nullable: true })
  referance: string; //reachiver employid
  @Column()
  ammount: number;
  @Column({ nullable: true })
  chequeNumber: string;
  @Column({ nullable: true })
  chequeBankName: string;
  @Column({ nullable: true })
  chequeIssueDate: string;
  @Column({ nullable: true })
  depositedAccount: string;
  @Column({ nullable: true })
  transferDate: string;
  @Column({ nullable: true })
  depositedFrom: string;
  @Column()
  status: string;
  @Column({ type: 'timestamp' })
  createdAt: Date;
  @Column({ type: 'timestamp' ,nullable:true})
  actionAt:string
  @Column({ nullable: true, default: 'NA' })
  rejectionReason: string;
  @ManyToOne(() => User, (user) => user.deposit, { onDelete: 'CASCADE' })
  user: User;
}

@Entity()
export class Wallet{
 @PrimaryGeneratedColumn() 
 id:number
 @Column({default:0})
 ammount:number
 @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
 @JoinColumn()
 user: User;
}
