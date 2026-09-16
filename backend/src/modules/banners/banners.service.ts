import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { ReorderBannersDto } from './dto/reorder-banners.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
  }

  async findAllAdmin() {
    return this.prisma.banner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id }
    });

    if (!banner) {
      throw new NotFoundException('Banner no encontrado.');
    }

    return banner;
  }

  async create(dto: CreateBannerDto) {
    let order = dto.order;
    if (order === undefined) {
      const max = await this.prisma.banner.aggregate({ _max: { order: true } });
      order = (max._max.order ?? -1) + 1;
    }

    const benefits =
      dto.benefits === null
        ? Prisma.JsonNull
        : dto.benefits !== undefined
          ? (dto.benefits as Prisma.InputJsonValue)
          : undefined;

    return this.prisma.banner.create({
      data: {
        title: dto.title.trim(),
        highlightedTitle: dto.highlightedTitle?.trim() || null,
        subtitle: dto.subtitle?.trim() || null,
        image: dto.image.trim(),
        link: dto.link?.trim() || '/catalogo',
        buttonText: dto.buttonText?.trim() || 'Ver ahora',
        benefits,
        order,
        isActive: dto.isActive ?? true
      }
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);

    const benefits =
      dto.benefits === null
        ? Prisma.JsonNull
        : dto.benefits !== undefined
          ? (dto.benefits as Prisma.InputJsonValue)
          : undefined;

    return this.prisma.banner.update({
      where: { id },
      data: {
        title: dto.title !== undefined ? dto.title.trim() : undefined,
        highlightedTitle:
          dto.highlightedTitle !== undefined ? dto.highlightedTitle?.trim() || null : undefined,
        subtitle: dto.subtitle !== undefined ? dto.subtitle?.trim() || null : undefined,
        image: dto.image !== undefined ? dto.image.trim() : undefined,
        link: dto.link !== undefined ? dto.link.trim() : undefined,
        buttonText: dto.buttonText !== undefined ? dto.buttonText.trim() : undefined,
        benefits,
        order: dto.order,
        isActive: dto.isActive
      }
    });
  }

  async reorder(dto: ReorderBannersDto) {
    const updates = dto.bannerIds.map((id, index) =>
      this.prisma.banner.update({
        where: { id },
        data: { order: index }
      })
    );

    await this.prisma.$transaction(updates);
    return this.findAllAdmin();
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.banner.delete({ where: { id } });
  }
}
