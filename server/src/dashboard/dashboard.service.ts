import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InspectionStatus, Severity } from '../../generated/prisma/enums';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [open, resolved, critical, major, minor] = await Promise.all([
      this.prisma.inspection.count({
        where: { status: InspectionStatus.OPEN },
      }),
      this.prisma.inspection.count({
        where: { status: InspectionStatus.RESOLVED },
      }),
      this.prisma.inspection.count({ where: { severity: Severity.CRITICAL } }),
      this.prisma.inspection.count({ where: { severity: Severity.MAJOR } }),
      this.prisma.inspection.count({ where: { severity: Severity.MINOR } }),
    ]);

    return {
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: { open, resolved, critical, major, minor },
    };
  }

  async getRecent(limit: number) {
    const data = await this.prisma.inspection.findMany({
      orderBy: { inspectionDate: 'desc' },
      take: limit,
      select: {
        id: true,
        machineId: true,
        severity: true,
        status: true,
        inspectionDate: true,
      },
    });

    return {
      success: true,
      message: 'Recent inspections fetched successfully',
      data,
    };
  }
}
