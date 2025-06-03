import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async createPreference(@Body() body: { items: any[]; orderId: string }) {
    const { items, orderId } = body;
    const preferenceUrl = await this.mercadoPagoService.createPreference(items, orderId);
    return { url: preferenceUrl };
  }

  @Get('status/:paymentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.mercadoPagoService.getPaymentStatus(paymentId);
  }
}
