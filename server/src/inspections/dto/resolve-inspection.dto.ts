import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ResolveInspectionDto {
  @ApiProperty({
    example: 'Machine needle replaced and calibration completed.',
  })
  @MinLength(5)
  resolutionNote!: string;
}
