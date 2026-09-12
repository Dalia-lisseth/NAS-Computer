import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { createSlug } from '../../common/utils/create-slug';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async create(dto: CreateCategoryDto) {
    const slug = createSlug(dto.slug || dto.name);
    try {
      return await this.prisma.category.create({ data: { name: dto.name.trim(), slug, icon: dto.icon?.trim(), description: dto.description?.trim() } });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    const slug = dto.slug || dto.name ? createSlug(dto.slug || dto.name || '') : undefined;
    try {
      return await this.prisma.category.update({ where: { id }, data: { ...dto, name: dto.name?.trim(), slug, icon: dto.icon?.trim(), description: dto.description?.trim() } });
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const products = await this.prisma.product.count({ where: { categoryId: id } });
    if (products) throw new ConflictException('No puedes eliminar una categoría con productos asociados.');
    await this.prisma.category.delete({ where: { id } });
  }

  private async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Categoría no encontrada.');
    return category;
  }

  private rethrowUnique(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Ya existe una categoría con ese nombre o slug.');
    }
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new ConflictException('Ya existe una categoría con ese nombre o slug.');
    }
    throw error;
  }
}
