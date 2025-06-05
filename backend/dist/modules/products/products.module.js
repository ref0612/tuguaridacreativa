"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const review_entity_1 = require("./entities/review.entity");
const products_controller_1 = require("./controllers/products.controller");
const categories_controller_1 = require("./controllers/categories.controller");
const products_service_1 = require("./services/products.service");
const categories_service_1 = require("./services/categories.service");
const auth_module_1 = require("../../auth/auth.module");
const users_module_1 = require("../../users/users.module");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.Product,
                category_entity_1.Category,
                product_image_entity_1.ProductImage,
                product_variant_entity_1.ProductVariant,
                review_entity_1.Review,
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
        ],
        controllers: [products_controller_1.ProductsController, categories_controller_1.CategoriesController],
        providers: [products_service_1.ProductsService, categories_service_1.CategoriesService],
        exports: [products_service_1.ProductsService, categories_service_1.CategoriesService],
    })
], ProductsModule);
//# sourceMappingURL=products.module.js.map