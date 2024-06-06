import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class HeaderDto {
  tag: string;
}

@Entity()
export class Header {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  filename: string;
  @Column()
  tag: string;
  @Column()
  path: string;
  @Column()
  size: number;
  @Column()
  mimetype: string;
}
