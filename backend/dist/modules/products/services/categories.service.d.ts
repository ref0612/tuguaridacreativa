import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class CategoriesService {
    private categoriesRepository;
    private productsRepository;
    private treeRepository;
    constructor(categoriesRepository: Repository<Category>, productsRepository: Repository<Product>);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(includeInactive?: boolean): Promise<Category[]>;
    findTree(includeInactive?: boolean): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findByIds(ids: string[]): Promise<Category[]>;
    findBySlug(slug: string): Promise<Category>;
    findFeatured(): Promise<Category[]>;
    findProductsByCategory(categoryId: string, paginationDto: PaginationDto & {
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'ASC' | 'DESC';
    }): Promise<PaginatedResponseDto<any>>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<boolean>;
    uploadImage(id: string, imageUrl: string): Promise<Category>;
    move(id: string, parentId?: string): Promise<Category>;
    private collectCategoryIds;
    private isDescendant;
}
