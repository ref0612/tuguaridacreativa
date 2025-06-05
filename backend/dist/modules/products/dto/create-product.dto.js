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
exports.CreateProductDto = exports.CreateProductVariantDto = exports.CreateProductImageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateProductImageDto {
}
exports.CreateProductImageDto = CreateProductImageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de la imagen', example: 'https://example.com/images/product-1.jpg' }),
    (0, class_validator_1.IsUrl)({}, { message: 'La URL de la imagen no es válida' }),
    __metadata("design:type", String)
], CreateProductImageDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Texto alternativo para accesibilidad', example: 'Producto en color rojo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductImageDto.prototype, "alt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Orden de visualización', example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductImageDto.prototype, "order", void 0);
class CreateProductVariantDto {
}
exports.CreateProductVariantDto = CreateProductVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la variante', example: 'Color' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la variante es requerido' }),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de variante',
        enum: ['color', 'size', 'material', 'style', 'other'],
        example: 'color'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El tipo de variante es requerido' }),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor de la variante', example: 'Rojo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El valor de la variante es requerido' }),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Código de color (si aplica)', example: '#FF0000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "colorCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU único de la variante', example: 'PROD-001-RED' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El SKU de la variante es requerido' }),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ajuste de precio (puede ser negativo para descuentos)',
        example: 0,
        default: 0
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El ajuste de precio debe ser un número' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "priceAdjustment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad en inventario',
        example: 100,
        default: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Peso adicional en gramos',
        example: 0,
        default: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El peso no puede ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductVariantDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la imagen específica para esta variante',
        example: 'https://example.com/images/product-1-red.jpg'
    }),
    (0, class_validator_1.IsUrl)({}, { message: 'La URL de la imagen no es válida' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductVariantDto.prototype, "image", void 0);
class CreateProductDto {
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del producto', example: 'Lienzo para pintura 40x60cm' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del producto es requerido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Slug único para URLs amigables',
        example: 'lienzo-para-pintura-40x60cm'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El slug es requerido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción corta del producto',
        example: 'Lienzo de tela de algodón para pintura al óleo y acrílico'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción detallada del producto',
        example: '<p>Lienzo de alta calidad para artistas profesionales y aficionados...</p>'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio base del producto',
        example: 24.99,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El precio debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El precio no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Precio de oferta (opcional)',
        example: 19.99,
        minimum: 0
    }),
    (0, class_validator_1.IsNumber)({}, { message: 'El precio de oferta debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'El precio de oferta no puede ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SKU único del producto',
        example: 'LIENZO-40X60-001'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El SKU es requerido' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad en inventario',
        example: 100,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El stock no puede ser negativo' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Peso del producto en gramos',
        example: 500,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El peso no puede ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ancho del producto en centímetros',
        example: 40,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El ancho no puede ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alto del producto en centímetros',
        example: 60,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'El alto no puede ser negativo' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profundidad del producto en centímetros',
        example: 2,
        minimum: 0
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'La profundidad no puede ser negativa' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indica si el producto está publicado',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indica si el producto está destacado',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Indica si el producto está en oferta',
        example: false,
        default: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isOnSale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IDs de las categorías a las que pertenece el producto',
        example: ['123e4567-e89b-12d3-a456-426614174000'],
        type: [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true, message: 'Cada ID de categoría debe ser un UUID válido' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "categoryIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Imágenes del producto',
        type: [CreateProductImageDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductImageDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Variantes del producto',
        type: [CreateProductVariantDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateProductVariantDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
//# sourceMappingURL=create-product.dto.js.map