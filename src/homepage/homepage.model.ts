
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class HomePage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('json', { nullable: true })
  banner:{ imageUrl: string; size: string; type: string }
  @Column('json',{nullable:true})
  sliderImage: Array<{ imageUrl: string; size: string; type: string }>
}
