import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InspectionStatus, Severity } from '../../generated/prisma/enums';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [open, resolved, grouped] = await Promise.all([
      this.prisma.inspection.count({
        where: { status: InspectionStatus.OPEN },
      }),
      this.prisma.inspection.count({
        where: { status: InspectionStatus.RESOLVED },
      }),
      this.prisma.inspection.groupBy({
        by: ['severity', 'status'],
        _count: { _all: true },
      }),
    ]);

    const countFor = (severity: Severity, status: InspectionStatus) =>
      grouped.find((g) => g.severity === severity && g.status === status)
        ?._count._all ?? 0;

    const bySeverity = Object.values(Severity).map((severity) => {
      const openCount = countFor(severity, InspectionStatus.OPEN);
      const resolvedCount = countFor(severity, InspectionStatus.RESOLVED);
      return {
        severity,
        open: openCount,
        resolved: resolvedCount,
        total: openCount + resolvedCount,
      };
    });

    const totalFor = (severity: Severity) =>
      bySeverity.find((s) => s.severity === severity)?.total ?? 0;

    return {
      success: true,
      message: 'Dashboard summary fetched successfully',
      data: {
        open,
        resolved,
        critical: totalFor(Severity.CRITICAL),
        major: totalFor(Severity.MAJOR),
        minor: totalFor(Severity.MINOR),
        bySeverity,
      },
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
