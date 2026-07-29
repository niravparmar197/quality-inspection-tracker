import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefectType, Severity } from '../../../generated/prisma/enums';

export class CreateInspectionDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  inspectionDate!: string;

  @ApiProperty({ example: 'MC-101' })
  @IsNotEmpty()
  machineId!: string;

  @ApiProperty({ enum: DefectType, example: DefectType.HOLE_TEAR })
  @IsEnum(DefectType)
  defectType!: DefectType;

  @ApiProperty({ enum: Severity, example: Severity.MAJOR })
  @IsEnum(Severity)
  severity!: Severity;

  @ApiProperty({ required: false, example: 'Found near the selvedge' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
