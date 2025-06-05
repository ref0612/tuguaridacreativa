import { CreateCategoryDto } from './create-category.dto';
declare const UpdateCategoryDto_base: import("@nestjs/common").Type<Partial<CreateCategoryDto>>;
export declare class UpdateCategoryDto extends UpdateCategoryDto_base {
    name?: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId?: string | null;
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
export {};
