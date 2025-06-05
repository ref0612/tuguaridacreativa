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
var Category_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("./product.entity");
const slugify_1 = require("../../../common/utils/slugify");
let Category = Category_1 = class Category {
    constructor() {
        this.description = '';
        this.image = null;
        this.thumbnail = null;
        this.metaTitle = null;
        this.metaDescription = null;
        this.metaKeywords = null;
        this.order = 0;
        this.isActive = true;
        this.isFeatured = false;
        this.deletedAt = null;
        this.products = [];
        this.children = [];
        this.parent = null;
        this.level = 0;
        this.path = null;
    }
    generateSlugAndPath() {
        if (this.name && !this.slug) {
            this.slug = (0, slugify_1.slugify)(this.name);
        }
        this.updatePath();
    }
    afterLoad() {
        this.updatePath();
    }
    updatePath() {
        if (this.parent) {
            const parentPath = this.parent.path || '';
            this.path = parentPath ? `${parentPath} > ${this.name}` : this.name;
        }
        else {
            this.path = this.name;
        }
    }
    addProduct(product) {
        if (!this.products) {
            this.products = [];
        }
        const exists = this.products.some(p => p.id === product.id);
        if (!exists) {
            this.products.push(product);
        }
    }
    removeProduct(productId) {
        if (!this.products)
            return false;
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);
        return this.products.length < initialLength;
    }
    isDescendantOf(categoryId) {
        if (!this.parent)
            return false;
        if (this.parent.id === categoryId)
            return true;
        return this.parent.isDescendantOf(categoryId);
    }
    getTotalProductCount(includeChildren = true) {
        let count = this.products?.length || 0;
        if (includeChildren && this.children) {
            this.children.forEach(child => {
                count += child.getTotalProductCount(includeChildren);
            });
        }
        return count;
    }
    static createDefault(partial) {
        const category = new Category_1();
        Object.assign(category, {
            name: '',
            slug: '',
            description: '',
            image: null,
            thumbnail: null,
            metaTitle: null,
            metaDescription: null,
            metaKeywords: null,
            order: 0,
            isActive: true,
            isFeatured: false,
            deletedAt: null,
            products: [],
            children: [],
            parent: null,
            level: 0,
            path: null
        });
        if (partial) {
            Object.assign(category, partial);
        }
        return category;
    }
};
exports.Category = Category;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la categoría',
        example: '123e4567-e89b-12d3-a456-426614174000',
        readOnly: true
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Category.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la categoría', example: 'Pinturas' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Slug único para URLs amigables',
        example: 'pinturas',
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción de la categoría', example: 'Materiales de pintura para artistas' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la imagen de la categoría',
        example: 'https://example.com/images/pinturas.jpg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL de la miniatura de la categoría',
        example: 'https://example.com/images/thumbnails/pinturas.jpg',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "thumbnail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadatos SEO: Título para SEO',
        example: 'Pinturas profesionales para artistas - Tienda de Arte',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadatos SEO: Descripción para SEO',
        example: 'Encuentra las mejores pinturas profesionales para tus obras de arte. Gran variedad de colores y marcas.',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Metadatos SEO: Palabras clave para SEO',
        example: 'pinturas, arte, materiales artísticos, colores, lienzos',
        nullable: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "metaKeywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Orden de visualización', example: 1 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Category.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la categoría está activa',
        example: true,
        default: true
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la categoría está destacada',
        example: false,
        default: false
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Category.prototype, "isFeatured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fecha de eliminación suave (soft delete)',
        example: '2023-01-01T00:00:00.000Z',
        nullable: true,
        readOnly: true
    }),
    (0, typeorm_1.DeleteDateColumn)({ type: 'timestamp with time zone', nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "deletedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos asociados a esta categoría',
        type: () => [product_entity_1.Product],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.ManyToMany)(() => product_entity_1.Product, (product) => product.categories, {
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Subcategorías de esta categoría',
        type: () => [Category],
        isArray: true,
        readOnly: true
    }),
    (0, typeorm_1.TreeChildren)(),
    __metadata("design:type", Array)
], Category.prototype, "children", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría padre',
        type: () => Category,
        nullable: true,
        readOnly: true
    }),
    (0, typeorm_1.TreeParent)(),
    __metadata("design:type", Object)
], Category.prototype, "parent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nivel en la jerarquía de categorías',
        example: 0,
        readOnly: true
    }),
    (0, typeorm_1.TreeLevelColumn)(),
    __metadata("design:type", Number)
], Category.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ruta completa de la categoría en el árbol',
        example: 'Arte>Pinturas>Óleos',
        readOnly: true
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Category.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación de la categoría',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Category.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización de la categoría',
        example: '2023-01-01T00:00:00.000Z',
        readOnly: true
    }),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Category.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Category.prototype, "generateSlugAndPath", null);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Category.prototype, "afterLoad", null);
exports.Category = Category = Category_1 = __decorate([
    (0, typeorm_1.Entity)('categories'),
    (0, typeorm_1.Tree)('materialized-path')
], Category);
//# sourceMappingURL=category.entity.js.map