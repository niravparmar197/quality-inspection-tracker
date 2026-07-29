import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { InspectionStatus } from '../../generated/prisma/enums';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { ResolveInspectionDto } from './dto/resolve-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateInspectionDto, createdById: string) {
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

  async findAll(filter: FilterInspectionDto) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;

    const where: Prisma.InspectionWhereInput = {
      severity: filter.severity,
      status: filter.status,
      machineId: filter.search ? { contains: filter.search } : undefined,
    };

    if (filter.fromDate || filter.toDate) {
      where.inspectionDate = {
        gte: filter.fromDate ? new Date(filter.fromDate) : undefined,
        lte: filter.toDate ? new Date(filter.toDate) : undefined,
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.inspection.findMany({
        where,
        orderBy: { inspectionDate: filter.sort ?? 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.inspection.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const inspection = await this.prisma.inspection.findUnique({
      where: { id },
    });
    if (!inspection) {
      throw new NotFoundException(`Inspection ${id} not found`);
    }
    return inspection;
  }

  async update(id: string, dto: UpdateInspectionDto) {
    await this.findOne(id);
    return this.prisma.inspection.update({ where: { id }, data: dto });
  }

  async resolve(id: string, dto: ResolveInspectionDto) {
    const inspection = await this.findOne(id);
    if (inspection.status === InspectionStatus.RESOLVED) {
      throw new ConflictException('Inspection is already resolved');
    }

    return this.prisma.inspection.update({
      where: { id },
      data: {
        status: InspectionStatus.RESOLVED,
        resolutionNote: dto.resolutionNote,
      },
    });
  }
}
