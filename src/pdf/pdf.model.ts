import { ApiProperty } from '@nestjs/swagger';

export class SectionDto {
  @ApiProperty({ example: 'Introduction' })
  heading: string;

  @ApiProperty({ example: 'This is the introduction section.' })
  text: string;
}

export class ReportDto {
  @ApiProperty({ example: 'Sample Report' })
  title: string;

  @ApiProperty({ example: 'John Doe' })
  author: string;

  @ApiProperty({ example: '2024-06-05' })
  date: string;

  @ApiProperty({ type: [SectionDto] })
  sections: SectionDto[];
}
