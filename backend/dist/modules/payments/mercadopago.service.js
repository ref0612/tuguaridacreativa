"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MercadoPagoService = void 0;
const common_1 = require("@nestjs/common");
const mercadopago = __importStar(require("mercadopago"));
let MercadoPagoService = class MercadoPagoService {
    constructor() {
        mercadopago.configure({
            access_token: 'TEST-15bfbe6a-f419-4bf7-a476-0d6e8cc2711b',
        });
    }
    async createPreference(items, orderId) {
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
        }
        catch (error) {
            console.error('Error creating MercadoPago preference:', error);
            throw new Error('Error al procesar el pago');
        }
    }
    async getPaymentStatus(paymentId) {
        try {
            const payment = await mercadopago.payment.get(Number(paymentId));
            return {
                status: payment.body.status,
                status_detail: payment.body.status_detail,
                order_id: payment.body.external_reference,
            };
        }
        catch (error) {
            console.error('Error getting payment status:', error);
            throw new Error('Error al obtener el estado del pago');
        }
    }
};
exports.MercadoPagoService = MercadoPagoService;
exports.MercadoPagoService = MercadoPagoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MercadoPagoService);
//# sourceMappingURL=mercadopago.service.js.map