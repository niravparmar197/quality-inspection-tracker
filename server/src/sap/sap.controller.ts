import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sap')
@Controller('sap')
export class SapController {
  @Post('inspection')
  receiveInspection(@Body() body: unknown) {
    console.log('SAP received:', body);
    return {
      success: true,
      message: 'Inspection received by SAP',
    };
  }
}
