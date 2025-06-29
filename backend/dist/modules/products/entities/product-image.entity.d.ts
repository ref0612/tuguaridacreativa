import { Product } from './product.entity';
export declare class ProductImage {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    isMain: boolean;
    responsiveUrls: Record<string, string> | null;
    alt: string | null;
    title: string | null;
    description: string | null;
    attributes: Record<string, any> | null;
    order: number;
    isActive: boolean;
    width: number | null;
    height: number | null;
    size: number | null;
    fileHash: string | null;
    originalName: string | null;
    mimeType: string | null;
    format: string | null;
    exif: Record<string, any> | null;
    product: Product;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    getDimensions(): string | null;
    getFormattedSize(): string | null;
    hasDimensions(width?: number, height?: number): boolean;
    hasAspectRatio(ratio: number, tolerance?: number): boolean;
    static createDefault(partial?: Partial<ProductImage>): ProductImage;
}
