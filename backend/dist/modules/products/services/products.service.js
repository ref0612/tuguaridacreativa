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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const product_image_entity_1 = require("../entities/product-image.entity");
const product_variant_entity_1 = require("../entities/product-variant.entity");
const categories_service_1 = require("./categories.service");
let ProductsService = class ProductsService {
    constructor(productsRepository, productImagesRepository, productVariantsRepository, categoriesService, dataSource) {
        this.productsRepository = productsRepository;
        this.productImagesRepository = productImagesRepository;
        this.productVariantsRepository = productVariantsRepository;
        this.categoriesService = categoriesService;
        this.dataSource = dataSource;
    }
    async create(createProductDto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const existingProduct = await this.productsRepository.findOne({
                where: [{ sku: createProductDto.sku }, { slug: createProductDto.slug }],
            });
            if (existingProduct) {
                if (existingProduct.sku === createProductDto.sku) {
                    throw new common_1.ConflictException(`Ya existe un producto con el SKU: ${createProductDto.sku}`);
                }
                else {
                    throw new common_1.ConflictException(`Ya existe un producto con el slug: ${createProductDto.slug}`);
                }
            }
            const product = this.productsRepository.create({
                ...createProductDto,
                user: { id: userId },
            });
            const savedProduct = await queryRunner.manager.save(product);
            if (createProductDto.categoryIds && createProductDto.categoryIds.length > 0) {
                const categories = await this.categoriesService.findByIds(createProductDto.categoryIds);
                savedProduct.categories = categories;
                await queryRunner.manager.save(savedProduct);
            }
            if (createProductDto.images && createProductDto.images.length > 0) {
                const images = createProductDto.images.map(imageDto => this.productImagesRepository.create({
                    ...imageDto,
                    product: savedProduct,
                }));
                savedProduct.images = await queryRunner.manager.save(images);
            }
            if (createProductDto.variants && createProductDto.variants.length > 0) {
                const variants = createProductDto.variants.map(variantDto => this.productVariantsRepository.create({
                    ...variantDto,
                    product: savedProduct,
                }));
                savedProduct.variants = await queryRunner.manager.save(variants);
            }
            await queryRunner.commitTransaction();
            return this.findOne(savedProduct.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al crear el producto');
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search, category, minPrice, maxPrice, sortBy, sortOrder = 'DESC' } = paginationDto;
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        const order = {};
        const relations = { images: true, categories: true };
        if (search) {
            where.name = (0, typeorm_2.Like)(`%${search}%`);
        }
        if (category) {
            where.categories = { id: category };
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price = { ...where.price, $gte: minPrice };
            if (maxPrice !== undefined)
                where.price = { ...where.price, $lte: maxPrice };
        }
        if (sortBy) {
            order[sortBy] = sortOrder;
        }
        else {
            order.createdAt = 'DESC';
        }
        const [items, total] = await this.productsRepository.findAndCount({
            where,
            relations,
            order,
            skip,
            take: limit,
        });
        return {
            items,
            meta: {
                totalItems: total,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['images', 'categories', 'variants', 'reviews', 'user'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
        }
        return product;
    }
    async findBySlug(slug) {
        const product = await this.productsRepository.findOne({
            where: { slug },
            relations: ['images', 'categories', 'variants', 'reviews', 'user'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con slug "${slug}" no encontrado`);
        }
        return product;
    }
    async findFeatured() {
        return this.productsRepository.find({
            where: { isFeatured: true, isPublished: true },
            relations: ['images'],
            take: 10,
            order: { createdAt: 'DESC' },
        });
    }
    async findOnSale() {
        return this.productsRepository.find({
            where: { isOnSale: true, isPublished: true },
            relations: ['images'],
            take: 10,
            order: { updatedAt: 'DESC' },
        });
    }
    async findNewArrivals(days = 30) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.productsRepository.find({
            where: {
                isPublished: true,
                createdAt: { $gte: date },
            },
            relations: ['images'],
            take: 10,
            order: { createdAt: 'DESC' },
        });
    }
    async search(query) {
        return this.productsRepository.find({
            where: [
                { name: (0, typeorm_2.Like)(`%${query}%`), isPublished: true },
                { description: (0, typeorm_2.Like)(`%${query}%`), isPublished: true },
                { shortDescription: (0, typeorm_2.Like)(`%${query}%`), isPublished: true },
            ],
            relations: ['images'],
            take: 10,
        });
    }
    async update(id, updateProductDto, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await this.productsRepository.findOne({
                where: { id },
                relations: ['categories', 'images', 'variants'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
            }
            if (product.userId !== userId) {
                const user = await queryRunner.manager.findOne('User', { where: { id: userId } });
                if (user?.role !== 'admin') {
                    throw new common_1.BadRequestException('No tienes permiso para actualizar este producto');
                }
            }
            Object.assign(product, updateProductDto);
            if (updateProductDto.categoryIdsToAdd || updateProductDto.categoryIdsToRemove) {
                const currentCategoryIds = product.categories.map(cat => cat.id);
                const categoriesToAdd = updateProductDto.categoryIdsToAdd || [];
                const categoriesToRemove = updateProductDto.categoryIdsToRemove || [];
                const newCategoryIds = [
                    ...currentCategoryIds.filter(id => !categoriesToRemove.includes(id)),
                    ...categoriesToAdd.filter(id => !currentCategoryIds.includes(id)),
                ];
                if (newCategoryIds.length > 0) {
                    product.categories = await this.categoriesService.findByIds(newCategoryIds);
                }
                else {
                    product.categories = [];
                }
            }
            if (updateProductDto.imagesToAdd && updateProductDto.imagesToAdd.length > 0) {
                const newImages = updateProductDto.imagesToAdd.map(imageDto => this.productImagesRepository.create({
                    ...imageDto,
                    product: { id },
                }));
                await queryRunner.manager.save(newImages);
            }
            if (updateProductDto.imageIdsToRemove && updateProductDto.imageIdsToRemove.length > 0) {
                await this.productImagesRepository.delete({
                    id: (0, typeorm_2.In)(updateProductDto.imageIdsToRemove),
                    product: { id },
                });
            }
            if (updateProductDto.variantsToAdd && updateProductDto.variantsToAdd.length > 0) {
                const newVariants = updateProductDto.variantsToAdd.map(variantDto => this.productVariantsRepository.create({
                    ...variantDto,
                    product: { id },
                }));
                await queryRunner.manager.save(newVariants);
            }
            if (updateProductDto.variantsToUpdate && updateProductDto.variantsToUpdate.length > 0) {
                for (const variantDto of updateProductDto.variantsToUpdate) {
                    await this.productVariantsRepository.update({ id: variantDto.id, product: { id } }, variantDto);
                }
            }
            if (updateProductDto.variantIdsToRemove && updateProductDto.variantIdsToRemove.length > 0) {
                await this.productVariantsRepository.delete({
                    id: (0, typeorm_2.In)(updateProductDto.variantIdsToRemove),
                    product: { id },
                });
            }
            const updatedProduct = await queryRunner.manager.save(product);
            await queryRunner.commitTransaction();
            return this.findOne(updatedProduct.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al actualizar el producto');
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const product = await this.productsRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
            }
            if (product.userId !== userId) {
                const user = await queryRunner.manager.findOne('User', { where: { id: userId } });
                if (user?.role !== 'admin') {
                    throw new common_1.BadRequestException('No tienes permiso para eliminar este producto');
                }
            }
            await this.productImagesRepository.delete({ product: { id } });
            await this.productVariantsRepository.delete({ product: { id } });
            await this.productsRepository.remove(product);
            await queryRunner.commitTransaction();
            return true;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error al eliminar el producto');
        }
        finally {
            await queryRunner.release();
        }
    }
    async addImages(id, imageUrls, userId) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
        }
        if (product.userId !== userId) {
            const user = await this.dataSource.manager.findOne('User', { where: { id: userId } });
            if (user?.role !== 'admin') {
                throw new common_1.BadRequestException('No tienes permiso para modificar este producto');
            }
        }
        const images = imageUrls.map(url => this.productImagesRepository.create({
            url,
            product: { id },
        }));
        await this.productImagesRepository.save(images);
        return this.findOne(id);
    }
    async removeImage(id, imageId, userId) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['user', 'images'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Producto con ID "${id}" no encontrado`);
        }
        if (product.userId !== userId) {
            const user = await this.dataSource.manager.findOne('User', { where: { id: userId } });
            if (user?.role !== 'admin') {
                throw new common_1.BadRequestException('No tienes permiso para modificar este producto');
            }
        }
        const imageExists = product.images.some(img => img.id === imageId);
        if (!imageExists) {
            throw new common_1.NotFoundException(`Imagen con ID "${imageId}" no encontrada en este producto`);
        }
        await this.productImagesRepository.delete({ id: imageId, product: { id } });
        return this.findOne(id);
    }
    async increaseViewCount(id) {
        await this.productsRepository.increment({ id }, 'viewCount', 1);
    }
    async updateStock(id, quantity) {
        const result = await this.productsRepository
            .createQueryBuilder()
            .update(product_entity_1.Product)
            .set({ stock: () => `stock + ${quantity}` })
            .where('id = :id AND stock + :quantity >= 0', { id, quantity })
            .execute();
        return result.affected > 0;
    }
    async updateAverageRating(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['reviews'],
        });
        if (!product)
            return;
        if (product.reviews && product.reviews.length > 0) {
            const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
            product.averageRating = Number((sum / product.reviews.length).toFixed(1));
            product.reviewCount = product.reviews.length;
        }
        else {
            product.averageRating = 0;
            product.reviewCount = 0;
        }
        await this.productsRepository.save(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __param(2, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => categories_service_1.CategoriesService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        categories_service_1.CategoriesService,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map