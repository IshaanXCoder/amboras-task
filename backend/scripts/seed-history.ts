import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let store_id;

  args.forEach(arg => {
    if (arg.startsWith('--store=')) store_id = arg.split('=')[1];
  });

  if (!store_id) {
    console.error("Usage: npx ts-node scripts/seed-history.ts --store=<UUID_HERE>");
    const stores = await prisma.store.findMany();
    console.log("Available Stores in Database:");
    stores.forEach(s => console.log(`- ${s.name}: ${s.id}`));
    process.exit(1);
  }

  const eventTypes = ['page_view', 'add_to_cart', 'remove_from_cart', 'checkout_started', 'purchase'];
  const events = [];

  console.log(`Generating past 3 days of historical data for Store: ${store_id}...`);

  for (let i = 0; i < 2000; i++) {
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let data: any = {};
    if (type === 'purchase') {
      data = {
        product_id: `prod_${Math.floor(Math.random() * 10)}`,
        amount: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        currency: 'USD'
      };
    }

    // Randomize timestamp over the last 72 hours (3 days)
    const now = new Date();
    const pastMs = Math.floor(Math.random() * (72 * 60 * 60 * 1000));
    now.setTime(now.getTime() - pastMs);

    events.push({
      event_id: randomUUID(),
      store_id,
      event_type: type,
      data,
      timestamp: now,
    });
  }

  // Insert directly into PostgreSQL database
  await prisma.event.createMany({
    data: events,
  });

  console.log(`✅ successfully injected 2,000 historical events spanning the last 72 hours!`);
  console.log(`You can now switch your GUI Dashboard to 'Last 7 Days' and see the historical data render!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
