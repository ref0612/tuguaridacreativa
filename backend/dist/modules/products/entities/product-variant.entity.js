"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariant = exports.VariantType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("./product.entity");
var VariantType;
(function (VariantType) {
    VariantType["COLOR"] = "color";
    VariantType["SIZE"] = "size";
    VariantType["MATERIAL"] = "material";
    VariantType["STYLE"] = "style";
    VariantType["OTHER"] = "other";
})(VariantType || (exports.VariantType = VariantType = {}));
let ProductVariant = class ProductVariant {
    get totalPrice() {
        return this.product ? this.product.price + this.priceAdjustment : 0;
    }
    updateStock(quantity) {
        if (this.stock + quantity < 0) {
            return false;
        }
        this.stock += quantity;
        return true;
    }
    hasStock(quantity = 1) {
        return this.stock >= quantity;
    }
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la variante', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductVariant.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la variante', example: 'Color' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ProductVariant.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de variante',
        example: 'color',
        enum: VariantType,
        enumName: 'VariantType'
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VariantType,
        default: VariantType.OTHER
    }),
    __metadata("design:type", String)
], ProductVariant.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor de la variante', example: 'Rojo' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], ProductVariant.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de color (si aplica)', example: '#FF0000' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU único de la variante', example: 'LIENZO-40X60-RED' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio adicional (puede ser negativo para descuentos)', example: 5.99 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "priceAdjustment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad en inventario', example: 50 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Peso adicional en gramos', example: 100 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Imagen específica para esta variante (opcional)', example: 'https://example.com/images/red-canvas.jpg' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ProductVariant.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si esta variante está activa', example: true }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.variants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductVariant.prototype, "updatedAt", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, typeorm_1.Entity)('product_variants')
], ProductVariant);
//# sourceMappingURL=product-variant.entity.js.map