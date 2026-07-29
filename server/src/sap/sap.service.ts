import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionDto } from '../inspections/dto/create-inspection.dto';

const SAP_SYSTEM_USER_EMAIL = 'sap-integration@system.local';

@Injectable()
export class SapService {
  private readonly logger = new Logger(SapService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async notifyInspection(inspection: unknown) {
    const url = this.configService.get<string>(
      'SAP_WEBHOOK_URL',
      'http://localhost:3000/sap/inspection',
    );

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inspection),
      });

      if (!response.ok) {
        throw new Error(`SAP endpoint responded with ${response.status}`);
      }

      this.logger.log(`SAP Sync Status: ✓ Success (${url})`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`SAP Sync Status: ✗ Failed - ${message}`);
    }
  }

  async createFromWebhook(dto: CreateInspectionDto) {
    const createdById = await this.getSystemUserId();

    return this.prisma.inspection.create({
      data: {
        inspectionDate: new Date(dto.inspectionDate),
        machineId: dto.machineId,
        defectType: dto.defectType,
        severity: dto.severity,
        remarks: dto.remarks,
        createdById,
      },
    });
  }

  private async getSystemUserId(): Promise<string> {
    const existing = await this.prisma.user.findUnique({
      where: { email: SAP_SYSTEM_USER_EMAIL },
    });
    if (existing) return existing.id;

    const created = await this.prisma.user.create({
      data: {
        name: 'SAP Integration',
        email: SAP_SYSTEM_USER_EMAIL,
        password: await bcrypt.hash(randomUUID(), 10),
      },
    });
    return created.id;
  }
}
