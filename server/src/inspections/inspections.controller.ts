import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { ResolveInspectionDto } from './dto/resolve-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';

@ApiTags('inspections')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  create(
    @Body() dto: CreateInspectionDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.inspectionsService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query() filter: FilterInspectionDto) {
    return this.inspectionsService.findAll(filter);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  update(@Param('id') id: string, @Body() dto: UpdateInspectionDto) {
    return this.inspectionsService.update(id, dto);
  }

  @Patch(':id/resolve')
  @ApiResponse({ status: 404, description: 'Inspection not found' })
  @ApiResponse({ status: 409, description: 'Inspection is already resolved' })
  resolve(@Param('id') id: string, @Body() dto: ResolveInspectionDto) {
    return this.inspectionsService.resolve(id, dto);
  }
}
