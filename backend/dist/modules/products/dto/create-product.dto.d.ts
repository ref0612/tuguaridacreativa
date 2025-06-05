export declare class CreateProductImageDto {
    url: string;
    alt?: string;
    order?: number;
}
export declare class CreateProductVariantDto {
    name: string;
    type: string;
    value: string;
    colorCode?: string;
    sku: string;
    priceAdjustment?: number;
    stock: number;
    weight?: number;
    image?: string;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    shortDescription?: string;
    description?: string;
    price: number;
    salePrice?: number;
    sku: string;
    stock: number;
    weight?: number;
    width?: number;
    height?: number;
    depth?: number;
    isPublished?: boolean;
    isFeatured?: boolean;
    isOnSale?: boolean;
    categoryIds?: string[];
    images?: CreateProductImageDto[];
    variants?: CreateProductVariantDto[];
}
