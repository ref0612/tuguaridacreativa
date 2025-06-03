import { Injectable } from '@nestjs/common';
import * as mercadopago from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  constructor() {
    mercadopago.configure({
      access_token: 'TEST-15bfbe6a-f419-4bf7-a476-0d6e8cc2711b',
    });
  }

  async createPreference(items: any[], orderId: string) {
    try {
      const preference = {
        items: items.map(item => ({
          id: item.id,
          title: item.name,
          description: item.description || '',
          quantity: item.quantity,
          currency_id: 'ARS',
          unit_price: parseFloat(item.price),
        })),
        external_reference: orderId,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/success`,
          failure: `${process.env.FRONTEND_URL}/checkout/failure`,
          pending: `${process.env.FRONTEND_URL}/checkout/pending`,
        },
        auto_return: 'approved',
      };

      const response = await mercadopago.preferences.create(preference);
      return response.body.init_point || response.body.sandbox_init_point;
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw new Error('Error al procesar el pago');
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const payment = await mercadopago.payment.get(Number(paymentId));
      return {
        status: payment.body.status,
        status_detail: payment.body.status_detail,
        order_id: payment.body.external_reference,
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error('Error al obtener el estado del pago');
    }
  }
}
