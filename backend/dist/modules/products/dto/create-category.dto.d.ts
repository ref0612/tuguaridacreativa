export declare class CreateCategoryDto {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}
