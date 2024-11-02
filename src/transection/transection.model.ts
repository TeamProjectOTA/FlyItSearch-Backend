import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
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
  bookingId: string;
  @Column({ nullable: true,type: 'double' })
  paidAmount: number;
  @Column({ nullable: true,type: 'double'})
  offerAmmount: number;
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
  @Column({ nullable: true })
  walletBalance: number;
  @Column()
  paymentType: string;
  @Column({nullable:true})
  paymentId:string
  @ManyToOne(() => User, (user) => user.transection, { onDelete: 'CASCADE' })
  user: User;
}
export class CreateTransectionDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiProperty()
  @IsOptional()
  paidAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  offerAmmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currierName?: string;
}
