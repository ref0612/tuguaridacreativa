import { Request } from 'express';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, req: Request): Promise<Product>;
    findAll(paginationDto: PaginationDto, search?: string, category?: string, minPrice?: number, maxPrice?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<PaginatedResponseDto<Product>>;
    findFeatured(): Promise<Product[]>;
    findOnSale(): Promise<Product[]>;
    findNewArrivals(): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    findBySlug(slug: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto, req: Request): Promise<Product>;
    remove(id: string, req: Request): Promise<void>;
    addImages(id: string, imageUrls: string[], req: Request): Promise<Product>;
    removeImage(id: string, imageId: string, req: Request): Promise<Product>;
}
