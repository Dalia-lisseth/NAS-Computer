import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type PublicUser = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'role' | 'isActive' | 'createdAt'>;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Ya existe una cuenta con este correo.');

    const user = await this.prisma.user.create({
      data: { name: dto.name.trim(), email, phone: dto.phone?.trim(), passwordHash: await bcrypt.hash(dto.password, 12) }
    });
    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const isValid = user && user.isActive && await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Correo o contraseña incorrectos.');
    return this.createSession(user);
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return this.toPublicUser(user);
  }

  private createSession(user: User) {
    return {
      accessToken: this.jwt.sign({ sub: user.id, email: user.email, role: user.role }),
      user: this.toPublicUser(user)
    };
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash: _passwordHash, updatedAt: _updatedAt, ...publicUser } = user;
    return publicUser;
  }
}
