import { Module, Global } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class DatabaseModule {}

@Module({
  imports: [
    DatabaseModule,
    AnalyticsModule,
    EventsModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
