import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '../prisma.service';

@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService, private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(202) // Accepted (processing async buffer)
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.trackEvent(createEventDto);
  }

  @Post('seed')
  async seed() {
    // Fetch real stores from the database instead of hardcoded strings
    const activeStores = await this.prisma.store.findMany({ select: { id: true } });
    if (activeStores.length === 0) {
      throw new BadRequestException("No stores exist in the DB! Create one via GUI or CLI first.");
    }
    
    const stores = activeStores.map(s => s.id);
    const eventTypes = ['page_view', 'add_to_cart', 'remove_from_cart', 'checkout_started', 'purchase'];
    
    let generated = 0;
    
    // Seed 1000 random events to simulate traffic
    for (let i = 0; i < 1000; i++) {
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const store = stores[Math.floor(Math.random() * stores.length)];
        
        let data: any = {};
        if (type === 'purchase') {
            data = {
                product_id: `prod_${Math.floor(Math.random() * 10)}`,
                amount: parseFloat((Math.random() * 100 + 10).toFixed(2)),
                currency: 'USD'
            };
        }
        
        await this.eventsService.trackEvent({
             store_id: store,
             event_type: type,
             data
        });
        generated++;
    }
    
    return { success: true, count: generated, message: 'Seeding initiated' };
  }
}
