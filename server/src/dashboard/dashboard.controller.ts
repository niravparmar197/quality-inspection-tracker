import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

const DEFAULT_RECENT_LIMIT = 5;
const MAX_RECENT_LIMIT = 10;

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('recent')
  getRecent(@Query('limit') limit?: string) {
    const parsed = limit ? parseInt(limit, 10) : DEFAULT_RECENT_LIMIT;
    const safeLimit =
      Number.isFinite(parsed) && parsed > 0
        ? Math.min(parsed, MAX_RECENT_LIMIT)
        : DEFAULT_RECENT_LIMIT;

    return this.dashboardService.getRecent(safeLimit);
  }
}
