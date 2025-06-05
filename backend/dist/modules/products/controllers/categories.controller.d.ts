import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(includeInactive?: boolean): Promise<Category[]>;
    findTree(includeInactive?: boolean): Promise<Category[]>;
    findFeatured(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    findBySlug(slug: string): Promise<Category>;
    findProductsByCategory(id: string, paginationDto: PaginationDto, minPrice?: number, maxPrice?: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): Promise<PaginatedResponseDto<any>>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<void>;
    uploadImage(id: string, imageUrl: string): Promise<Category>;
    move(id: string, parentId?: string): Promise<Category>;
}
