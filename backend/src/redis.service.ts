import { Injectable, OnModuleInit, OnModuleDestroy, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
  }

  onModuleInit() {
    console.log('Redis initialized');
  }

  onModuleDestroy() {
    this.quit();
  }
}
