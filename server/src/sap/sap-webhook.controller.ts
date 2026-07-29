import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInspectionDto } from '../inspections/dto/create-inspection.dto';
import { SapService } from './sap.service';

@ApiTags('sap')
@Controller('api')
export class SapWebhookController {
  constructor(private readonly sapService: SapService) {}

  @Post('sap-webhook')
  @ApiOperation({
    summary:
      'SAP webhook receiver - accepts a defect payload and auto-creates an inspection',
  })
  handleWebhook(@Body() dto: CreateInspectionDto) {
    return this.sapService.createFromWebhook(dto);
  }
}
