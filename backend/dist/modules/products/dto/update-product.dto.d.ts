import { CreateProductDto } from './create-product.dto';
export declare class UpdateProductImageDto {
    id?: string;
    url?: string;
    alt?: string;
    order?: number;
}
export declare class UpdateProductVariantDto {
    id?: string;
    name?: string;
    type?: string;
    value?: string;
    colorCode?: string;
    sku?: string;
    priceAdjustment?: number;
    stock?: number;
    weight?: number;
    image?: string;
}
declare const UpdateProductDto_base: import("@nestjs/common").Type<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    categoryIdsToAdd?: string[];
    categoryIdsToRemove?: string[];
    imagesToAdd?: UpdateProductImageDto[];
    imageIdsToRemove?: string[];
    variantsToAdd?: UpdateProductVariantDto[];
    variantsToUpdate?: UpdateProductVariantDto[];
    variantIdsToRemove?: string[];
}
export {};
