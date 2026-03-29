import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  let name, password;

  // Extremely basic arg parser for a script: `ts-node script.ts --name=Foo --password=Bar`
  args.forEach(arg => {
    if (arg.startsWith('--name=')) name = arg.split('=')[1];
    if (arg.startsWith('--password=')) password = arg.split('=')[1];
  });

  if (!name || !password) {
    console.error("Usage: ts-node create-store.ts --name=<StoreName> --password=<StorePassword>");
    process.exit(1);
  }

  try {
    const existing = await prisma.store.findUnique({ where: { name } });
    if (existing) {
      console.error(`Error: Store with name "${name}" already exists!`);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const store = await prisma.store.create({
      data: {
        name,
        password: hashedPassword,
      }
    });

    console.log(`\n✅ Store successfully created!`);
    console.log(`-----------------------------------`);
    console.log(`Store Name : ${store.name}`);
    console.log(`Store ID   : ${store.id}`);
    console.log(`-----------------------------------\n`);
    console.log(`You may now use this name and password in the GUI to sign in.`);
    
  } catch (err) {
    console.error("Database Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
