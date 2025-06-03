import { MercadoPagoService } from './mercadopago.service';
export declare class PaymentsController {
    private readonly mercadoPagoService;
    constructor(mercadoPagoService: MercadoPagoService);
    createPreference(body: {
        items: any[];
        orderId: string;
    }): Promise<{
        url: any;
    }>;
    getPaymentStatus(paymentId: string): Promise<{
        status: any;
        status_detail: any;
        order_id: any;
    }>;
}
