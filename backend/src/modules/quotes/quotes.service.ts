import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QueryQuotesDto } from './dto/query-quotes.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';

const quoteInclude = {
  items: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  }
} satisfies Prisma.QuoteInclude;

@Injectable()
export class QuotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuoteDto, userId?: string) {
    const code = await this.generateUniqueCode();

    let total = 0;
    const itemsData = dto.items.map((item) => {
      const subtotal = Number((item.unitPrice * item.quantity).toFixed(2));
      total += subtotal;
      return {
        productId: item.productId || null,
        productName: item.productName.trim(),
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal
      };
    });

    return this.prisma.quote.create({
      data: {
        code,
        userId: userId || null,
        customerName: dto.customerName.trim(),
        customerEmail: dto.customerEmail.trim().toLowerCase(),
        customerPhone: dto.customerPhone?.trim() || null,
        notes: dto.notes?.trim() || null,
        channel: dto.channel?.trim() || 'web',
        total: Number(total.toFixed(2)),
        items: {
          create: itemsData
        }
      },
      include: quoteInclude
    });
  }

  async findAll(query: QueryQuotesDto) {
    const { search, status, channel, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.QuoteWhereInput = {
      ...(status ? { status } : {}),
      ...(channel ? { channel: { equals: channel, mode: 'insensitive' } } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { code: { contains: search.trim(), mode: 'insensitive' } },
              { customerName: { contains: search.trim(), mode: 'insensitive' } },
              { customerEmail: { contains: search.trim(), mode: 'insensitive' } },
              { customerPhone: { contains: search.trim(), mode: 'insensitive' } }
            ]
          }
        : {})
    };

    const [total, quotes] = await Promise.all([
      this.prisma.quote.count({ where }),
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: quoteInclude
      })
    ]);

    return {
      data: quotes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findByUser(userId: string) {
    return this.prisma.quote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: quoteInclude
    });
  }

  async findOne(idOrCode: string) {
    const quote = await this.prisma.quote.findFirst({
      where: {
        OR: [{ id: idOrCode }, { code: idOrCode }]
      },
      include: quoteInclude
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada.');
    }

    return quote;
  }

  async updateStatus(idOrCode: string, dto: UpdateQuoteStatusDto) {
    const quote = await this.findOne(idOrCode);

    return this.prisma.quote.update({
      where: { id: quote.id },
      data: {
        status: dto.status,
        notes: dto.notes !== undefined ? dto.notes.trim() || null : undefined
      },
      include: quoteInclude
    });
  }

  async remove(idOrCode: string) {
    const quote = await this.findOne(idOrCode);
    await this.prisma.quote.delete({ where: { id: quote.id } });
  }

  private async generateUniqueCode(): Promise<string> {
    for (let attempts = 0; attempts < 10; attempts++) {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
      const code = `COT-${randomSuffix}`;
      const existing = await this.prisma.quote.findUnique({ where: { code } });
      if (!existing) return code;
    }
    return `COT-${Date.now().toString().slice(-6)}`;
  }
}
