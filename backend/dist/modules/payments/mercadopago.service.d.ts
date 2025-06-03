export declare class MercadoPagoService {
    constructor();
    createPreference(items: any[], orderId: string): Promise<any>;
    getPaymentStatus(paymentId: string): Promise<{
        status: any;
        status_detail: any;
        order_id: any;
    }>;
}
