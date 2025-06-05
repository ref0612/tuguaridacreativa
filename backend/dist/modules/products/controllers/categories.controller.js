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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const categories_service_1 = require("../services/categories.service");
const create_category_dto_1 = require("../dto/create-category.dto");
const update_category_dto_1 = require("../dto/update-category.dto");
const category_entity_1 = require("../entities/category.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const paginated_response_dto_1 = require("../../common/dto/paginated-response.dto");
let CategoriesController = class CategoriesController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async create(createCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }
    async findAll(includeInactive = false) {
        return this.categoriesService.findAll(includeInactive);
    }
    async findTree(includeInactive = false) {
        return this.categoriesService.findTree(includeInactive);
    }
    async findFeatured() {
        return this.categoriesService.findFeatured();
    }
    async findOne(id) {
        const category = await this.categoriesService.findOne(id);
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        return category;
    }
    async findBySlug(slug) {
        const category = await this.categoriesService.findBySlug(slug);
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con slug "${slug}" no encontrada`);
        }
        return category;
    }
    async findProductsByCategory(id, paginationDto, minPrice, maxPrice, sortBy, sortOrder) {
        return this.categoriesService.findProductsByCategory(id, {
            ...paginationDto,
            minPrice,
            maxPrice,
            sortBy,
            sortOrder,
        });
    }
    async update(id, updateCategoryDto) {
        const category = await this.categoriesService.update(id, updateCategoryDto);
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
        return category;
    }
    async remove(id) {
        const result = await this.categoriesService.remove(id);
        if (!result) {
            throw new common_1.NotFoundException(`Categoría con ID "${id}" no encontrada`);
        }
    }
    async uploadImage(id, imageUrl) {
        if (!imageUrl) {
            throw new common_1.BadRequestException('La URL de la imagen es requerida');
        }
        return this.categoriesService.uploadImage(id, imageUrl);
    }
    async move(id, parentId) {
        return this.categoriesService.move(id, parentId);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva categoría' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categoría creada exitosamente', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos para realizar esta acción' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías', type: [category_entity_1.Category] }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el árbol de categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Árbol de categorías', type: [category_entity_1.Category] }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findTree", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener categorías destacadas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías destacadas', type: [category_entity_1.Category] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findFeatured", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría encontrada', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría encontrada', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos de una categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos de la categoría', type: paginated_response_dto_1.PaginatedResponseDto }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('minPrice')),
    __param(3, (0, common_1.Query)('maxPrice')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_a = typeof pagination_dto_1.PaginationDto !== "undefined" && pagination_dto_1.PaginationDto) === "function" ? _a : Object, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findProductsByCategory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría actualizada exitosamente', type: category_entity_1.Category }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de entrada inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos para realizar esta acción' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría eliminada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'No se puede eliminar una categoría con subcategorías o productos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tiene permisos para realizar esta acción' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Subir imagen para una categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imagen subida exitosamente', type: category_entity_1.Category }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('imageUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)(':id/move'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mover una categoría dentro del árbol' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría movida exitosamente', type: category_entity_1.Category }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "move", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map