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
var ProductImage_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImage = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const product_entity_1 = require("./product.entity");
let ProductImage = ProductImage_1 = class ProductImage {
    constructor() {
        this.thumbnailUrl = null;
        this.isMain = false;
        this.responsiveUrls = null;
        this.alt = null;
        this.title = null;
        this.description = null;
        this.attributes = null;
        this.order = 0;
        this.isActive = true;
        this.width = null;
        this.height = null;
        this.size = null;
        this.fileHash = null;
        this.originalName = null;
        this.mimeType = null;
        this.format = null;
        this.exif = null;
        this.deletedAt = null;
    }
    getDimensions() {
        if (this.width && this.height) {
            return `${this.width}x${this.height}px`;
        }
        return null;
    }
    getFormattedSize() {
        if (!this.size)
            return null;
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = this.size;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        const roundedSize = size < 10 ? Math.round(size * 10) / 10 : Math.round(size);
        return `${roundedSize} ${units[unitIndex]}`;
    }
    hasDimensions(width, height) {
        if (width !== undefined && this.width !== width)
            return false;
        if (height !== undefined && this.height !== height)
            return false;
        return true;
    }
    hasAspectRatio(ratio, tolerance = 0.1) {
        if (!this.width || !this.height)
            return false;
        const imageRatio = this.width / this.height;
        return Math.abs(imageRatio - ratio) <= tolerance;
    }
    static createDefault(partial) {
        const image = new ProductImage_1();
        Object.assign(image, {
            url: '',
            thumbnailUrl: null,
            isMain: false,
            responsiveUrls: null,
            alt: null,
            title: null,
            description: null,
            attributes: null,
            order: 0,
            isActive: true,
            width: null,
            height: null,
            size: null,
            fileHash: null,
            originalName: null,
            mimeType: null,
            format: null,
            exif: null,
            productId: '',
            deletedAt: null
        });
        if (partial) {
            Object.assign(image, partial);
        }
        return image;
    }
};
exports.ProductImage = ProductImage;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la imagen',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductImage.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen',
        example: 'https://example.com/images/product-1.jpg',
        required: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: false }),
    __metadata("design:type", String)
], ProductImage.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la miniatura de la imagen',
        example: 'https://example.com/images/thumbnails/product-1.jpg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si esta es la imagen principal del producto',
        example: false,
        default: false
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], ProductImage.prototype, "isMain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la imagen en diferentes tamaños (responsive)',
        example: {
            small: 'https://example.com/images/small/product-1.jpg',
            medium: 'https://example.com/images/medium/product-1.jpg',
            large: 'https://example.com/images/large/product-1.jpg'
        },
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "responsiveUrls", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Texto alternativo para accesibilidad (alt text)',
        example: 'Lienzo para pintura 40x60cm - Vista frontal',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "alt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Título de la imagen (title attribute)',
        example: 'Lienzo profesional 40x60cm',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción detallada de la imagen',
        example: 'Vista frontal del lienzo de algodón de 40x60cm',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Atributos adicionales para la imagen',
        example: { color: 'rojo', angle: 'frontal' },
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "attributes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Orden de visualización',
        example: 1,
        default: 0
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductImage.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la imagen está activa',
        example: true,
        default: true
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], ProductImage.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ancho de la imagen en píxeles',
        example: 800,
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Alto de la imagen en píxeles',
        example: 600,
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tamaño del archivo en bytes',
        example: 102400,
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Hash del archivo para detección de duplicados',
        example: 'a1b2c3d4e5f6...',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "fileHash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Nombre original del archivo',
        example: 'lienzo-profesional.jpg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "originalName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tipo MIME de la imagen',
        example: 'image/jpeg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Formato de la imagen',
        example: 'jpeg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "format", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadatos EXIF de la imagen',
        example: { make: 'Canon', model: 'EOS 5D', exposure: '1/250' },
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "exif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Producto al que pertenece la imagen',
        type: () => product_entity_1.Product,
        readOnly: true
    }),
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.images, {
        onDelete: 'CASCADE',
        nullable: false
    }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], ProductImage.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto al que pertenece la imagen',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], ProductImage.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductImage.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización del registro',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductImage.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha de eliminación suave (soft delete)',
        example: '2023-01-01T00:00:00.000Z',
        nullable: true,
        readOnly: true
    }),
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Object)
], ProductImage.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tamaño del archivo formateado',
        example: '1.5 MB',
        nullable: true,
        readOnly: true
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], ProductImage.prototype, "getFormattedSize", null);
exports.ProductImage = ProductImage = ProductImage_1 = __decorate([
    (0, typeorm_1.Entity)('product_images'),
    (0, typeorm_1.Index)(['productId', 'isMain']),
    (0, typeorm_1.Index)(['productId', 'order'])
], ProductImage);
//# sourceMappingURL=product-image.entity.js.map