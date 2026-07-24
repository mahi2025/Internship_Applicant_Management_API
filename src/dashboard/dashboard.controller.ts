import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('dashbaoard')
@ApiBearerAuth('access-token')
@Controller('dashboard')

export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
