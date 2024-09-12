import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transection {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tranId: string;
  @Column({ nullable: true })
  tranDate: string;
  @Column({ nullable: true })
  paidAmount: string;
  @Column({ nullable: true })
  offerAmmount: string;
  @Column({ nullable: true })
  bankTranId: string;
  @Column({ nullable: true })
  riskTitle: string;
  @Column({ nullable: true })
  cardType: string;
  @Column({ nullable: true })
  cardIssuer: string;
  @Column({ nullable: true })
  cardBrand: string;
  @Column({ nullable: true })
  cardIssuerCountry: string;
  @Column({ nullable: true })
  validationDate: string;
  @Column()
  status: string;
  @Column({ nullable: true })
  currierName: string;
  @Column()
  requestType: string;

  @ManyToOne(() => User, (user) => user.transection, { onDelete: 'CASCADE' })
  user: User;
}
