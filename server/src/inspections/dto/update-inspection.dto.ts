import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DefectType, Severity } from '../../../generated/prisma/enums';

export class UpdateInspectionDto {
  @ApiProperty({ required: false, example: 'MC-101' })
  @IsOptional()
  @IsString()
  machineId?: string;

  @ApiProperty({ enum: DefectType, required: false })
  @IsOptional()
  @IsEnum(DefectType)
  defectType?: DefectType;

  @ApiProperty({ enum: Severity, required: false })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @ApiProperty({ required: false, example: 'Found near the selvedge' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
