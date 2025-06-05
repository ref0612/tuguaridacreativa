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
var Product_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const category_entity_1 = require("./category.entity");
const product_image_entity_1 = require("./product-image.entity");
const product_variant_entity_1 = require("./product-variant.entity");
const review_entity_1 = require("./review.entity");
const slugify_1 = require("../../../common/utils/slugify");
let Product = Product_1 = class Product {
    get isAvailable() {
        return this.isPublished && this.stock > 0;
    }
    get onSale() {
        return this.salePrice !== null && this.salePrice < this.price;
    }
    get discountPercentage() {
        if (!this.onSale)
            return null;
        return Math.round(((this.price - this.salePrice) / this.price) * 100);
    }
    get mainImage() {
        if (!this.images || this.images.length === 0)
            return null;
        const main = this.images.find(img => img.isMain) || this.images[0];
        return main.url;
    }
    get minPrice() {
        if (!this.variants || this.variants.length === 0) {
            return this.price;
        }
        return Math.min(...this.variants.map(v => v.price));
    }
    get maxPrice() {
        if (!this.variants || this.variants.length === 0) {
            return this.price;
        }
        return Math.max(...this.variants.map(v => v.price));
    }
    get variantTypes() {
        if (!this.variants || this.variants.length === 0)
            return [];
        return [...new Set(this.variants.map(v => v.type))];
    }
    generateSlug() {
        if (this.name && !this.slug) {
            this.slug = (0, slugify_1.slugify)(this.name);
        }
    }
    setDefaultValues() {
        if (this.stock === undefined)
            this.stock = 0;
        if (this.totalSales === undefined)
            this.totalSales = 0;
        if (this.viewCount === undefined)
            this.viewCount = 0;
        if (this.averageRating === undefined)
            this.averageRating = 0;
        if (this.reviewCount === undefined)
            this.reviewCount = 0;
    }
    updateComputedFields() {
        if (this.reviews && this.reviews.length > 0) {
            const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
            this.averageRating = Number((sum / this.reviews.length).toFixed(1));
            this.reviewCount = this.reviews.length;
        }
        else {
            this.averageRating = 0;
            this.reviewCount = 0;
        }
    }
    updateStock(quantity) {
        const newStock = this.stock + quantity;
        if (newStock < 0)
            return false;
        this.stock = newStock;
        return true;
    }
    incrementViewCount() {
        this.viewCount += 1;
    }
    recordSale(quantity = 1) {
        this.totalSales += quantity;
        this.stock = Math.max(0, this.stock - quantity);
    }
    getVariantOptions(type) {
        if (!this.variants || this.variants.length === 0)
            return [];
        const variantsOfType = this.variants.filter(v => v.type === type);
        const uniqueValues = new Map();
        variantsOfType.forEach(variant => {
            if (!uniqueValues.has(variant.value)) {
                uniqueValues.set(variant.value, {
                    value: variant.value,
                    label: variant.name || variant.value,
                    colorCode: variant.colorCode
                });
            }
        });
        return Array.from(uniqueValues.values());
    }
    findVariant(attributes) {
        if (!this.variants || this.variants.length === 0)
            return null;
        return this.variants.find(variant => {
            return Object.entries(attributes).every(([key, value]) => {
                return variant.attributes?.[key] === value ||
                    (key === 'color' && variant.colorCode === value) ||
                    (key === 'size' && variant.value === value);
            });
        }) || null;
    }
    static createDefault(partial) {
        const product = new Product_1();
        product.name = '';
        product.slug = '';
        product.price = 0;
        product.salePrice = null;
        product.sku = '';
        product.stock = 0;
        product.weight = null;
        product.width = null;
        product.height = null;
        product.depth = null;
        product.isPublished = false;
        product.isFeatured = false;
        product.isOnSale = false;
        product.averageRating = 0;
        product.reviewCount = 0;
        product.totalSales = 0;
        product.viewCount = 0;
        product.categories = [];
        product.images = [];
        product.variants = [];
        product.reviews = [];
        if (partial) {
            Object.assign(product, partial);
        }
        return product;
    }
};
exports.Product = Product;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del producto',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que creó el producto',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del producto', example: 'Lienzo para pintura 40x60cm' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Slug único para URLs amigables',
        example: 'lienzo-para-pintura-40x60cm',
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción corta del producto', example: 'Lienzo de tela de algodón para pintura al óleo y acrílico' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "shortDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción detallada del producto', example: '<p>Lienzo de alta calidad para artistas profesionales y aficionados...</p>' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio base del producto', example: 24.99 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Precio de oferta (opcional)',
        example: 19.99,
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "salePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'SKU único del producto', example: 'LIENZO-40X60-001' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad en inventario', example: 100 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Peso del producto en gramos', example: 500 }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ancho del producto en centímetros', example: 40 }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alto del producto en centímetros', example: 60 }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Profundidad del producto en centímetros', example: 2 }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si el producto está publicado', example: true }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si el producto está destacado', example: false }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si el producto está en oferta', example: false }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isOnSale", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Puntuación media del producto (0-5)', example: 4.5 }),
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "averageRating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número total de reseñas', example: 15 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reviewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número total de ventas',
        example: 42,
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "totalSales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de visualizaciones del producto',
        example: 150,
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de eliminación suave (soft delete)',
        example: '2023-01-01T00:00:00.000Z',
        nullable: true,
        readOnly: true
    }),
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que creó el producto',
        type: () => user_entity_1.User,
        readOnly: true
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.products, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Product.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categorías a las que pertenece el producto',
        type: () => [category_entity_1.Category],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.products, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'product_categories',
        joinColumn: { name: 'productId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Imágenes del producto',
        type: () => [product_image_entity_1.ProductImage],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.OneToMany)(() => product_image_entity_1.ProductImage, (image) => image.product, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Variantes del producto (tallas, colores, etc.)',
        type: () => [product_variant_entity_1.ProductVariant],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.OneToMany)(() => product_variant_entity_1.ProductVariant, (variant) => variant.product, {
        cascade: true,
        eager: true
    }),
    __metadata("design:type", Array)
], Product.prototype, "variants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reseñas del producto',
        type: () => [review_entity_1.Review],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.product, {
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Product.prototype, "reviews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el producto está disponible (publicado y con stock)',
        type: Boolean,
        readOnly: true
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], Product.prototype, "isAvailable", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el producto está en oferta',
        type: Boolean,
        readOnly: true
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], Product.prototype, "onSale", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Porcentaje de descuento (si aplica)',
        type: Number,
        nullable: true,
        readOnly: true,
        example: 20
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Product.prototype, "discountPercentage", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen principal del producto',
        type: String,
        nullable: true,
        readOnly: true,
        example: 'https://example.com/images/product-1.jpg'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Product.prototype, "mainImage", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio más bajo entre las variantes (si existen)',
        type: Number,
        readOnly: true,
        example: 19.99
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Product.prototype, "minPrice", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio más alto entre las variantes (si existen)',
        type: Number,
        readOnly: true,
        example: 29.99
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Product.prototype, "maxPrice", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipos de variantes disponibles (colores, tallas, etc.)',
        type: [String],
        readOnly: true,
        example: ['color', 'size']
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [])
], Product.prototype, "variantTypes", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "generateSlug", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "setDefaultValues", null);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    (0, typeorm_1.AfterRemove)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "updateComputedFields", null);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del producto',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización del producto',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = Product_1 = __decorate([
    (0, typeorm_1.Entity)('products')
], Product);
//# sourceMappingURL=product.entity.js.map