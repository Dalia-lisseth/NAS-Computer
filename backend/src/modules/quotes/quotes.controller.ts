import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QueryQuotesDto } from './dto/query-quotes.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  async create(@Body() dto: CreateQuoteDto, @Req() req: Request) {
    let userId: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.decode(token) as JwtPayload | null;
        if (payload?.sub) {
          userId = payload.sub;
        }
      } catch {
        // Ignora errores si el token no es válido o está expirado en la solicitud pública
      }
    }

    return this.quotesService.create(dto, userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query: QueryQuotesDto) {
    return this.quotesService.findAll(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMyQuotes(@CurrentUser() user: JwtPayload) {
    return this.quotesService.findByUser(user.sub);
  }

  @Get(':idOrCode')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('idOrCode') idOrCode: string) {
    return this.quotesService.findOne(idOrCode);
  }

  @Patch(':idOrCode/status')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStatus(@Param('idOrCode') idOrCode: string, @Body() dto: UpdateQuoteStatusDto) {
    return this.quotesService.updateStatus(idOrCode, dto);
  }

  @Delete(':idOrCode')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('idOrCode') idOrCode: string) {
    return this.quotesService.remove(idOrCode);
  }
}
