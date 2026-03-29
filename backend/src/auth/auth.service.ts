import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(name: string, passwordRaw: string) {
    if (!name || !passwordRaw) throw new BadRequestException('Name and Password required');
    
    // Check if store name exists
    const existing = await this.prisma.store.findUnique({ where: { name } });
    if (existing) {
      throw new BadRequestException('Store name already in use. Please select another or sign in.');
    }

    const saltRounds = 10;
    const password = await bcrypt.hash(passwordRaw, saltRounds);

    const store = await this.prisma.store.create({
      data: {
        name,
        password
      }
    });

    return { store_id: store.id, name: store.name };
  }

  async login(name: string, passwordRaw: string) {
    if (!name || !passwordRaw) throw new BadRequestException('Name and Password required');

    const store = await this.prisma.store.findUnique({ where: { name } });
    if (!store) {
      throw new UnauthorizedException('Invalid store name or password');
    }

    const isMatch = await bcrypt.compare(passwordRaw, store.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid store name or password');
    }

    return { store_id: store.id, name: store.name };
  }
}
