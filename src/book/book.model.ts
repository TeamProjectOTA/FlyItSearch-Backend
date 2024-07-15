import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  filename: string;
  @Column({ default: 'DEFAULT_PATH' })
  path: string;
  @Column()
  size: number;
  @Column()
  mimetype: string;
}

export class BookingID {
  @ApiProperty({ default: '22' })
  @IsNotEmpty()
  @IsString()
  BookingID: string;
}
