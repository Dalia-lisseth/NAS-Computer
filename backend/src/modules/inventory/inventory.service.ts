import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryMovementType, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { QueryMovementsDto } from './dto/query-movements.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(dto: CreateMovementDto, performedById?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId }
    });

    if (!product) {
      throw new NotFoundException('El producto indicado no existe.');
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    switch (dto.type) {
      case InventoryMovementType.ENTRY:
        newStock = previousStock + dto.quantity;
        break;

      case InventoryMovementType.EXIT:
        if (previousStock < dto.quantity) {
          throw new BadRequestException(
            `Stock insuficiente. El stock actual es de ${previousStock} unidades.`
          );
        }
        newStock = previousStock - dto.quantity;
        break;

      case InventoryMovementType.ADJUSTMENT:
        newStock = dto.quantity;
        break;
    }

    const [updatedProduct, movement] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: product.id },
        data: { stock: newStock }
      }),
      this.prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: dto.type,
          quantity: dto.quantity,
          previousStock,
          newStock,
          reason: dto.reason.trim(),
          performedById: performedById || null
        },
        include: {
          product: {
            select: { id: true, name: true, slug: true, stock: true, minimumStock: true }
          },
          performedBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    ]);

    const isBelowMinimum = updatedProduct.stock <= updatedProduct.minimumStock;

    return {
      movement,
      product: updatedProduct,
      alert: isBelowMinimum
        ? {
            productId: updatedProduct.id,
            name: updatedProduct.name,
            currentStock: updatedProduct.stock,
            minimumStock: updatedProduct.minimumStock,
            isOutOfStock: updatedProduct.stock === 0
          }
        : null
    };
  }

  async adjustStock(dto: AdjustStockDto, performedById?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId }
    });

    if (!product) {
      throw new NotFoundException('El producto indicado no existe.');
    }

    const previousStock = product.stock;
    const newStock = dto.newStock;
    const diff = newStock - previousStock;
    const quantity = Math.abs(diff);

    const [updatedProduct, movement] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: product.id },
        data: { stock: newStock }
      }),
      this.prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: InventoryMovementType.ADJUSTMENT,
          quantity,
          previousStock,
          newStock,
          reason: dto.reason.trim(),
          performedById: performedById || null
        },
        include: {
          product: {
            select: { id: true, name: true, slug: true, stock: true, minimumStock: true }
          },
          performedBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    ]);

    return {
      movement,
      product: updatedProduct,
      alert:
        updatedProduct.stock <= updatedProduct.minimumStock
          ? {
              productId: updatedProduct.id,
              name: updatedProduct.name,
              currentStock: updatedProduct.stock,
              minimumStock: updatedProduct.minimumStock,
              isOutOfStock: updatedProduct.stock === 0
            }
          : null
    };
  }

  async findMovements(query: QueryMovementsDto) {
    const { productId, type, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryMovementWhereInput = {
      ...(productId ? { productId } : {}),
      ...(type ? { type } : {})
    };

    const [total, movements] = await Promise.all([
      this.prisma.inventoryMovement.count({ where }),
      this.prisma.inventoryMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              stock: true,
              minimumStock: true,
              image: true
            }
          },
          performedBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    ]);

    return {
      data: movements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getStockAlerts() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { stock: 'asc' }
    });

    const alertProducts = products
      .filter((p) => p.stock <= p.minimumStock)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.image,
        price: p.price,
        stock: p.stock,
        minimumStock: p.minimumStock,
        category: p.category,
        alertType: p.stock === 0 ? ('OUT_OF_STOCK' as const) : ('LOW_STOCK' as const),
        deficiency: Math.max(0, p.minimumStock - p.stock)
      }));

    return {
      totalAlerts: alertProducts.length,
      outOfStockCount: alertProducts.filter((p) => p.alertType === 'OUT_OF_STOCK').length,
      lowStockCount: alertProducts.filter((p) => p.alertType === 'LOW_STOCK').length,
      products: alertProducts
    };
  }

  async getSummary() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        stock: true,
        minimumStock: true,
        price: true
      }
    });

    const totalProducts = products.length;
    let totalUnits = 0;
    let totalValuation = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;

    for (const p of products) {
      totalUnits += p.stock;
      totalValuation += Number(p.price) * p.stock;
      if (p.stock === 0) {
        outOfStockCount++;
      } else if (p.stock <= p.minimumStock) {
        lowStockCount++;
      }
    }

    return {
      totalProducts,
      totalUnits,
      totalValuation: Math.round(totalValuation * 100) / 100,
      outOfStockCount,
      lowStockCount,
      healthyStockCount: totalProducts - outOfStockCount - lowStockCount
    };
  }
}
