import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { QueryPromotionsDto } from './dto/query-promotions.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

const promotionInclude = {
  products: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          previousPrice: true,
          image: true,
          stock: true,
          badge: true
        }
      }
    }
  }
} satisfies Prisma.PromotionInclude;

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }]
      },
      include: promotionInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findAllAdmin(query: QueryPromotionsDto) {
    const { search, isActive, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.PromotionWhereInput = {
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { name: { contains: search.trim(), mode: 'insensitive' } },
              { description: { contains: search.trim(), mode: 'insensitive' } },
              { couponCode: { contains: search.trim(), mode: 'insensitive' } },
              { bannerText: { contains: search.trim(), mode: 'insensitive' } }
            ]
          }
        : {})
    };

    const [total, promotions] = await Promise.all([
      this.prisma.promotion.count({ where }),
      this.prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: promotionInclude
      })
    ]);

    return {
      data: promotions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: promotionInclude
    });

    if (!promotion) {
      throw new NotFoundException('Promoción no encontrada.');
    }

    return promotion;
  }

  async create(dto: CreatePromotionDto) {
    if (dto.couponCode) {
      const couponCode = dto.couponCode.trim().toUpperCase();
      const existing = await this.prisma.promotion.findUnique({ where: { couponCode } });
      if (existing) {
        throw new ConflictException('Ya existe una promoción con este código de cupón.');
      }
    }

    if (dto.productIds && dto.productIds.length > 0) {
      const count = await this.prisma.product.count({
        where: { id: { in: dto.productIds } }
      });
      if (count !== dto.productIds.length) {
        throw new NotFoundException('Uno o más productos seleccionados no existen.');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const promotion = await tx.promotion.create({
        data: {
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
          discountType: dto.discountType,
          discountValue: dto.discountValue,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          isActive: dto.isActive ?? true,
          bannerText: dto.bannerText?.trim() || null,
          couponCode: dto.couponCode ? dto.couponCode.trim().toUpperCase() : null
        }
      });

      if (dto.productIds && dto.productIds.length > 0) {
        await tx.productPromotion.createMany({
          data: dto.productIds.map((productId) => ({
            promotionId: promotion.id,
            productId
          }))
        });
      }

      return tx.promotion.findUniqueOrThrow({
        where: { id: promotion.id },
        include: promotionInclude
      });
    });
  }

  async update(id: string, dto: UpdatePromotionDto) {
    await this.findOne(id);

    if (dto.couponCode) {
      const couponCode = dto.couponCode.trim().toUpperCase();
      const existing = await this.prisma.promotion.findFirst({
        where: { couponCode, NOT: { id } }
      });
      if (existing) {
        throw new ConflictException('Ya existe otra promoción con este código de cupón.');
      }
    }

    if (dto.productIds && dto.productIds.length > 0) {
      const count = await this.prisma.product.count({
        where: { id: { in: dto.productIds } }
      });
      if (count !== dto.productIds.length) {
        throw new NotFoundException('Uno o más productos seleccionados no existen.');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.promotion.update({
        where: { id },
        data: {
          name: dto.name !== undefined ? dto.name.trim() : undefined,
          description: dto.description !== undefined ? dto.description.trim() || null : undefined,
          discountType: dto.discountType,
          discountValue: dto.discountValue,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate !== undefined ? (dto.endDate ? new Date(dto.endDate) : null) : undefined,
          isActive: dto.isActive,
          bannerText: dto.bannerText !== undefined ? dto.bannerText.trim() || null : undefined,
          couponCode:
            dto.couponCode !== undefined
              ? dto.couponCode
                ? dto.couponCode.trim().toUpperCase()
                : null
              : undefined
        }
      });

      if (dto.productIds !== undefined) {
        await tx.productPromotion.deleteMany({ where: { promotionId: id } });
        if (dto.productIds.length > 0) {
          await tx.productPromotion.createMany({
            data: dto.productIds.map((productId) => ({
              promotionId: id,
              productId
            }))
          });
        }
      }

      return tx.promotion.findUniqueOrThrow({
        where: { id },
        include: promotionInclude
      });
    });
  }

  async toggleStatus(id: string) {
    const promotion = await this.findOne(id);
    return this.prisma.promotion.update({
      where: { id },
      data: { isActive: !promotion.isActive },
      include: promotionInclude
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.promotion.delete({ where: { id } });
  }
}
