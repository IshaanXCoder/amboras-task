import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(
    @Query('store_id') storeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.analyticsService.getOverviewMetrics(storeId, startDate, endDate);
  }

  @Get('top-products')
  async getTopProducts(
    @Query('store_id') storeId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.analyticsService.getTopProducts(storeId, startDate, endDate);
  }

  @Get('recent-activity')
  async getRecentActivity(@Query('store_id') storeId: string) {
    return this.analyticsService.getRecentActivity(storeId);
  }
}
