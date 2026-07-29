import { Module } from '@nestjs/common';
import { SapController } from './sap.controller';
import { SapWebhookController } from './sap-webhook.controller';
import { SapService } from './sap.service';

@Module({
  controllers: [SapController, SapWebhookController],
  providers: [SapService],
  exports: [SapService],
})
export class SapModule {}
