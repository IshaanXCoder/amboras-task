import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsService.name);
  
  // In-memory buffer to batch DB inserts
  private eventsBuffer: any[] = [];
  private readonly MAX_BUFFER_SIZE = 1000;
  private intervalId: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  onModuleInit() {
    this.intervalId = setInterval(() => this.flushEvents(), 5000);
  }

  onModuleDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.flushEvents(); // flush remaining
  }

  async trackEvent(createEventDto: CreateEventDto) {
    const timestamp = new Date();
    
    // 1. Instantly buffer event for Postgres bulk insert to handle high volume
    this.eventsBuffer.push({
      store_id: createEventDto.store_id,
      event_type: createEventDto.event_type,
      data: createEventDto.data || {},
      timestamp,
    });

    // If buffer is full, trigger a flush asynchronously
    if (this.eventsBuffer.length >= this.MAX_BUFFER_SIZE) {
      this.flushEvents(); // don't await to keep response fast
    }

    // 2. Real-time aggregation in Redis for instant dashboard updates
    const dateKey = timestamp.toISOString().split('T')[0];
    const storeKey = `store:${createEventDto.store_id}:${dateKey}`;
    
    const multi = this.redis.multi();
    
    // Increment total events count
    multi.hincrby(storeKey, 'total_events', 1);
    
    // Increment specific event type count
    multi.hincrby(storeKey, `type:${createEventDto.event_type}`, 1);
    
    // Track revenue if it's a purchase
    if (createEventDto.event_type === 'purchase' && createEventDto.data?.amount) {
      // Redis INCRBYFLOAT for revenue
      multi.hincrbyfloat(storeKey, 'total_revenue', createEventDto.data.amount);
      
      // Update top products sorted set for this store and date
      if (createEventDto.data.product_id) {
        multi.zincrby(`store:${createEventDto.store_id}:top_products:${dateKey}`, createEventDto.data.amount, createEventDto.data.product_id);
      }
    }
    
    // Track active visitors (rolling 5 minutes)
    const activeVisitorsKey = `store:${createEventDto.store_id}:active_visitors`;
    const nowMs = timestamp.getTime();
    const fiveMinutesAgo = nowMs - 5 * 60 * 1000;
    multi.zadd(activeVisitorsKey, nowMs, `${nowMs}-${Math.random().toString(36).substring(7)}`);
    multi.zremrangebyscore(activeVisitorsKey, '-inf', fiveMinutesAgo);
    multi.expire(activeVisitorsKey, 60 * 60); // 1 hour TTL is enough
    
    // Push to recent activity list and trim to keep only last 20
    const activityListKey = `store:${createEventDto.store_id}:recent_activity`;
    const activityData = JSON.stringify({
      id: Math.random().toString(36).substring(7),
      type: createEventDto.event_type,
      data: createEventDto.data || {},
      timestamp: timestamp.toISOString()
    });
    multi.lpush(activityListKey, activityData);
    multi.ltrim(activityListKey, 0, 19);

    // Set TTL on these keys to automatically expire after 7 days
    multi.expire(storeKey, 60 * 60 * 24 * 7);
    multi.expire(`store:${createEventDto.store_id}:top_products:${dateKey}`, 60 * 60 * 24 * 7);
    multi.expire(activityListKey, 60 * 60 * 24 * 7);

    await multi.exec();

    return { success: true };
  }

  // Flush every 5 seconds or when buffer hits MAX_BUFFER_SIZE
  async flushEvents() {
    if (this.eventsBuffer.length === 0) return;

    const eventsToInsert = [...this.eventsBuffer];
    this.eventsBuffer = []; // reset buffer

    try {
      await this.prisma.event.createMany({
        data: eventsToInsert,
      });
      // this.logger.debug(`Flushed ${eventsToInsert.length} events to DB.`);
    } catch (error) {
      this.logger.error('Failed to flush events to DB', error);
      // In a real production app, we would push failed events to a DLQ or retry
    }
  }

  // Nightly aggregation job to roll up events into DailyStoreMetric table
  // For demonstration, runs every night at midnight, but could run hourly
  async aggregateDailyMetrics() {
    this.logger.log('Starting daily metrics aggregation...');
    // Real-world: run a complex group by query from `event` to `DailyStoreMetric`.
    // We already use Redis for real-time, so we'd build historically permanent records here.
  }
}
