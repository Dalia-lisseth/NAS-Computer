import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createSlug } from '../../common/utils/create-slug';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const productInclude = { category: true } satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(search?: string, category?: string, includeInactive = false) {
    const term = search?.trim();
    return this.prisma.product.findMany({
      where: {
        ...(includeInactive ? {} : { isActive: true }),
        ...(category ? { category: { slug: category } } : {}),
        ...(term ? { OR: [{ name: { contains: term, mode: 'insensitive' } }, { description: { contains: term, mode: 'insensitive' } }] } : {})
      },
      include: productInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(idOrSlug: string, includeInactive = false) {
    const product = await this.prisma.product.findFirst({ where: { ...(includeInactive ? {} : { isActive: true }), OR: [{ id: idOrSlug }, { slug: idOrSlug }] }, include: productInclude });
    if (!product) throw new NotFoundException('Producto no encontrado.');
    return product;
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategory(dto.categoryId);
    const slug = createSlug(dto.slug || dto.name);
    try {
      return await this.prisma.product.create({ data: { ...dto, name: dto.name.trim(), slug, description: dto.description?.trim() || '', image: dto.image?.trim(), badge: dto.badge?.trim(), previousPrice: dto.previousPrice ?? null, specifications: dto.specifications ?? undefined }, include: productInclude });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) throw new ConflictException('Ya existe un producto con ese slug.');
      throw error;
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id, true);
    if (dto.categoryId) await this.ensureCategory(dto.categoryId);
    const slug = dto.slug || dto.name ? createSlug(dto.slug || dto.name || '') : undefined;
    const { categoryId, specifications, ...data } = dto;
    try {
      return await this.prisma.product.update({ where: { id }, data: { ...data, name: dto.name?.trim(), slug, description: dto.description?.trim(), image: dto.image?.trim(), badge: dto.badge?.trim(), specifications: specifications === null ? Prisma.JsonNull : specifications, category: categoryId ? { connect: { id: categoryId } } : undefined }, include: productInclude });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) throw new ConflictException('Ya existe un producto con ese slug.');
      throw error;
    }
  }

  async remove(id: string) {
    await this.findOne(id, true);
    await this.prisma.product.delete({ where: { id } });
  }

  private async ensureCategory(id: string) {
    if (!await this.prisma.category.findUnique({ where: { id } })) throw new NotFoundException('La categoría indicada no existe.');
  }
}
