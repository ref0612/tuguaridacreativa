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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../entities/category.entity");
const product_entity_1 = require("../entities/product.entity");
let CategoriesService = class CategoriesService {
    constructor(categoriesRepository, productsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
        this.treeRepository = categoriesRepository.manager.getTreeRepository(category_entity_1.Category);
    }
    async create(createCategoryDto) {
        const existingCategory = await this.categoriesRepository.findOne({
            where: [
                { name: createCategoryDto.name },
                { slug: createCategoryDto.slug },
            ],
        });
        if (existingCategory) {
            if (existingCategory.name === createCategoryDto.name) {
                throw new common_1.ConflictException(`Ya existe una categoría con el nombre: ${createCategoryDto.name}`);
            }
            else {
                throw new common_1.ConflictException(`Ya existe una categoría con el slug: ${createCategoryDto.slug}`);
            }
        }
        const category = this.categoriesRepository.create(createCategoryDto);
        if (createCategoryDto.parentId) {
            const parentCategory = await this.categoriesRepository.findOne({
                where: { id: createCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException(`Categoría padre con ID "${createCategoryDto.parentId}" no encontrada`);
            }
            category.parent = parentCategory;
        }
        return this.categoriesRepository.save(category);
    }
    async findAll(includeInactive = false) {
        const where = {};
        if (!includeInactive) {
            where.isActive = true;
        }
        return this.categoriesRepository.find({
            where,
            order: { order: 'ASC', name: 'ASC' },
        });
    }
    async findTree(includeInactive = false) {
        const where = { parent: null };
        if (!includeInactive) {
            where.isActive = true;
        }
        const roots = await this.categoriesRepository.find({
            where,
            order: { order: 'ASC', name: 'ASC' },
        });
        return Promise.all(roots.map(root => this.treeRepository.findDescendantsTree(root, {
            depth: 10,
            relations: ['children'],
        })));
    }
    async findOne(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        return category;
    }
    async findByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        return this.categoriesRepository.find({
            where: { id: (0, typeorm_2.In)(ids) },
        });
    }
    async findBySlug(slug) {
        const category = await this.categoriesRepository.findOne({
            where: { slug },
            relations: ['parent', 'children'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con slug "${slug}" no encontrada`);
        }
        return category;
    }
    async findFeatured() {
        return this.categoriesRepository.find({
            where: { isFeatured: true, isActive: true },
            order: { order: 'ASC', name: 'ASC' },
            take: 10,
        });
    }
    async findProductsByCategory(categoryId, paginationDto) {
        const { page = 1, limit = 10, minPrice, maxPrice, sortBy, sortOrder = 'DESC' } = paginationDto;
        const skip = (page - 1) * limit;
        const category = await this.findOne(categoryId);
        const categoryTree = await this.treeRepository.findDescendantsTree(category, {
            relations: ['children'],
        });
        const categoryIds = this.collectCategoryIds(categoryTree);
        const query = this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.categories', 'category')
            .leftJoinAndSelect('product.images', 'image')
            .where('category.id IN (:...categoryIds)', { categoryIds })
            .andWhere('product.isPublished = :isPublished', { isPublished: true });
        if (minPrice !== undefined) {
            query.andWhere('product.price >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            query.andWhere('product.price <= :maxPrice', { maxPrice });
        }
        if (sortBy) {
            const order = {};
            order[`product.${sortBy}`] = sortOrder;
            query.orderBy(order);
        }
        else {
            query.orderBy('product.createdAt', 'DESC');
        }
        const [items, total] = await query
            .skip(skip)
            .take(limit)
            .getManyAndCount();
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
    async update(id, updateCategoryDto) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        if (updateCategoryDto.parentId !== undefined) {
            if (updateCategoryDto.parentId === null) {
                category.parent = null;
            }
            else if (updateCategoryDto.parentId !== category.parent?.id) {
                const parentCategory = await this.categoriesRepository.findOne({
                    where: { id: updateCategoryDto.parentId },
                });
                if (!parentCategory) {
                    throw new common_1.NotFoundException(`Categoría padre con ID "${updateCategoryDto.parentId}" no encontrada`);
                }
                if (await this.isDescendant(id, updateCategoryDto.parentId)) {
                    throw new common_1.BadRequestException('No se puede establecer una categoría hija como padre');
                }
                category.parent = parentCategory;
            }
        }
        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async remove(id) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['children', 'products'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        if (category.children && category.children.length > 0) {
            throw new common_1.BadRequestException('No se puede eliminar una categoría que tiene subcategorías');
        }
        const productCount = await this.productsRepository.count({
            where: { categories: { id } },
        });
        if (productCount > 0) {
            throw new common_1.BadRequestException('No se puede eliminar una categoría que tiene productos asociados');
        }
        await this.categoriesRepository.remove(category);
        return true;
    }
    async uploadImage(id, imageUrl) {
        const category = await this.categoriesRepository.findOneBy({ id });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        category.image = imageUrl;
        return this.categoriesRepository.save(category);
    }
    async move(id, parentId) {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['parent'],
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        if (!parentId) {
            category.parent = null;
            return this.categoriesRepository.save(category);
        }
        const parentCategory = await this.categoriesRepository.findOne({
            where: { id: parentId },
        });
        if (!parentCategory) {
            throw new common_1.NotFoundException(`Categoría padre con ID "${parentId}" no encontrada`);
        }
        if (await this.isDescendant(id, parentId)) {
            throw new common_1.BadRequestException('No se puede mover una categoría dentro de una de sus propias subcategorías');
        }
        category.parent = parentCategory;
        return this.categoriesRepository.save(category);
    }
    collectCategoryIds(category) {
        let ids = [category.id];
        if (category.children && category.children.length > 0) {
            for (const child of category.children) {
                ids = [...ids, ...this.collectCategoryIds(child)];
            }
        }
        return ids;
    }
    async isDescendant(parentId, childId) {
        if (parentId === childId)
            return true;
        const parentCategory = await this.categoriesRepository.findOne({
            where: { id: childId },
            relations: ['parent'],
        });
        if (!parentCategory || !parentCategory.parent)
            return false;
        if (parentCategory.parent.id === parentId)
            return true;
        return this.isDescendant(parentId, parentCategory.parent.id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map