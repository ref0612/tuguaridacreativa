import { Repository, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CategoriesService } from './categories.service';
export declare class ProductsService {
    private productsRepository;
    private productImagesRepository;
    private productVariantsRepository;
    private categoriesService;
    private dataSource;
    constructor(productsRepository: Repository<Product>, productImagesRepository: Repository<ProductImage>, productVariantsRepository: Repository<ProductVariant>, categoriesService: CategoriesService, dataSource: DataSource);
    create(createProductDto: CreateProductDto, userId: string): Promise<Product>;
    findAll(paginationDto: PaginationDto & {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<PaginatedResponseDto<Product>>;
    findOne(id: string): Promise<Product>;
    findBySlug(slug: string): Promise<Product>;
    findFeatured(): Promise<Product[]>;
    findOnSale(): Promise<Product[]>;
    findNewArrivals(days?: number): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<Product>;
    remove(id: string, userId: string): Promise<boolean>;
    addImages(id: string, imageUrls: string[], userId: string): Promise<Product>;
    removeImage(id: string, imageId: string, userId: string): Promise<Product>;
    increaseViewCount(id: string): Promise<void>;
    updateStock(id: string, quantity: number): Promise<boolean>;
    updateAverageRating(id: string): Promise<void>;
}
