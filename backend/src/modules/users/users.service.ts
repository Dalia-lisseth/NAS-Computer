import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type SanitizedUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUsersDto) {
    const { search, role, isActive, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { name: { contains: search.trim(), mode: 'insensitive' } },
              { email: { contains: search.trim(), mode: 'insensitive' } },
              { phone: { contains: search.trim(), mode: 'insensitive' } }
            ]
          }
        : {})
    };

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      })
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string): Promise<SanitizedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<SanitizedUser> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        phone: dto.phone?.trim() || null,
        passwordHash,
        role: dto.role,
        isActive: dto.isActive ?? true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<SanitizedUser> {
    await this.ensureUserExists(id);

    const updateData: Prisma.UserUpdateInput = {};

    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (dto.phone !== undefined) updateData.phone = dto.phone ? dto.phone.trim() : null;
    if (dto.role !== undefined) updateData.role = dto.role;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const existing = await this.prisma.user.findFirst({
        where: { email, NOT: { id } }
      });
      if (existing) {
        throw new ConflictException('Ya existe otro usuario con este correo electrónico.');
      }
      updateData.email = email;
    }

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async updateStatus(id: string, isActive: boolean, currentUserId?: string): Promise<SanitizedUser> {
    if (!isActive && currentUserId && id === currentUserId) {
      throw new BadRequestException('No puedes desactivar tu propia cuenta de administrador.');
    }

    await this.ensureUserExists(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async remove(id: string, currentUserId?: string): Promise<void> {
    if (currentUserId && id === currentUserId) {
      throw new BadRequestException('No puedes eliminar tu propia cuenta.');
    }

    await this.ensureUserExists(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async ensureUserExists(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }
}
