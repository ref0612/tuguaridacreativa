import { Product } from './product.entity';
export declare enum VariantType {
    COLOR = "color",
    SIZE = "size",
    MATERIAL = "material",
    STYLE = "style",
    OTHER = "other"
}
export declare class ProductVariant {
    id: string;
    name: string;
    type: VariantType;
    value: string;
    colorCode: string | null;
    sku: string;
    priceAdjustment: number;
    stock: number;
    weight: number;
    image: string | null;
    isActive: boolean;
    product: Product;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
    get totalPrice(): number;
    updateStock(quantity: number): boolean;
    hasStock(quantity?: number): boolean;
}
