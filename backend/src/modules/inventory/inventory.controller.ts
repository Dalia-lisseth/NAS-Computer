import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { QueryMovementsDto } from './dto/query-movements.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('summary')
  getSummary() {
    return this.inventoryService.getSummary();
  }

  @Get('alerts')
  getAlerts() {
    return this.inventoryService.getStockAlerts();
  }

  @Get('movements')
  findMovements(@Query() query: QueryMovementsDto) {
    return this.inventoryService.findMovements(query);
  }

  @Post('movements')
  createMovement(@Body() dto: CreateMovementDto, @CurrentUser() user: JwtPayload) {
    return this.inventoryService.createMovement(dto, user.sub);
  }

  @Post('adjust')
  adjustStock(@Body() dto: AdjustStockDto, @CurrentUser() user: JwtPayload) {
    return this.inventoryService.adjustStock(dto, user.sub);
  }
}
