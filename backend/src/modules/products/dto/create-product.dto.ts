import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsUUID, Min, Max, IsUrl, IsNotEmpty, ValidateNested, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductImageDto {
  @ApiProperty({ description: 'URL de la imagen', example: 'https://example.com/images/product-1.jpg' })
  @IsUrl({}, { message: 'La URL de la imagen no es válida' })
  url: string;

  @ApiPropertyOptional({ description: 'Texto alternativo para accesibilidad', example: 'Producto en color rojo' })
  @IsString()
  @IsOptional()
  alt?: string;

  @ApiPropertyOptional({ description: 'Orden de visualización', example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Nombre de la variante', example: 'Color' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la variante es requerido' })
  name: string;

  @ApiProperty({ 
    description: 'Tipo de variante', 
    enum: ['color', 'size', 'material', 'style', 'other'],
    example: 'color' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de variante es requerido' })
  type: string;

  @ApiProperty({ description: 'Valor de la variante', example: 'Rojo' })
  @IsString()
  @IsNotEmpty({ message: 'El valor de la variante es requerido' })
  value: string;

  @ApiPropertyOptional({ description: 'Código de color (si aplica)', example: '#FF0000' })
  @IsString()
  @IsOptional()
  colorCode?: string;

  @ApiProperty({ description: 'SKU único de la variante', example: 'PROD-001-RED' })
  @IsString()
  @IsNotEmpty({ message: 'El SKU de la variante es requerido' })
  sku: string;

  @ApiPropertyOptional({ 
    description: 'Ajuste de precio (puede ser negativo para descuentos)', 
    example: 0,
    default: 0 
  })
  @IsNumber({}, { message: 'El ajuste de precio debe ser un número' })
  @IsOptional()
  priceAdjustment?: number;

  @ApiProperty({ 
    description: 'Cantidad en inventario', 
    example: 100,
    default: 0 
  })
  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiPropertyOptional({ 
    description: 'Peso adicional en gramos', 
    example: 0,
    default: 0 
  })
  @IsInt()
  @Min(0, { message: 'El peso no puede ser negativo' })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ 
    description: 'URL de la imagen específica para esta variante', 
    example: 'https://example.com/images/product-1-red.jpg' 
  })
  @IsUrl({}, { message: 'La URL de la imagen no es válida' })
  @IsOptional()
  image?: string;
}

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Lienzo para pintura 40x60cm' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  name: string;

  @ApiProperty({ 
    description: 'Slug único para URLs amigables', 
    example: 'lienzo-para-pintura-40x60cm' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El slug es requerido' })
  slug: string;

  @ApiPropertyOptional({ 
    description: 'Descripción corta del producto', 
    example: 'Lienzo de tela de algodón para pintura al óleo y acrílico' 
  })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ 
    description: 'Descripción detallada del producto', 
    example: '<p>Lienzo de alta calidad para artistas profesionales y aficionados...</p>' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Precio base del producto', 
    example: 24.99,
    minimum: 0 
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiPropertyOptional({ 
    description: 'Precio de oferta (opcional)', 
    example: 19.99,
    minimum: 0 
  })
  @IsNumber({}, { message: 'El precio de oferta debe ser un número' })
  @Min(0, { message: 'El precio de oferta no puede ser negativo' })
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ 
    description: 'SKU único del producto', 
    example: 'LIENZO-40X60-001' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El SKU es requerido' })
  sku: string;

  @ApiProperty({ 
    description: 'Cantidad en inventario', 
    example: 100,
    minimum: 0 
  })
  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiPropertyOptional({ 
    description: 'Peso del producto en gramos', 
    example: 500,
    minimum: 0 
  })
  @IsInt()
  @Min(0, { message: 'El peso no puede ser negativo' })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ 
    description: 'Ancho del producto en centímetros', 
    example: 40,
    minimum: 0 
  })
  @IsInt()
  @Min(0, { message: 'El ancho no puede ser negativo' })
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ 
    description: 'Alto del producto en centímetros', 
    example: 60,
    minimum: 0 
  })
  @IsInt()
  @Min(0, { message: 'El alto no puede ser negativo' })
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ 
    description: 'Profundidad del producto en centímetros', 
    example: 2,
    minimum: 0 
  })
  @IsInt()
  @Min(0, { message: 'La profundidad no puede ser negativa' })
  @IsOptional()
  depth?: number;

  @ApiPropertyOptional({ 
    description: 'Indica si el producto está publicado', 
    example: false,
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ 
    description: 'Indica si el producto está destacado', 
    example: false,
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ 
    description: 'Indica si el producto está en oferta', 
    example: false,
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isOnSale?: boolean;

  @ApiPropertyOptional({ 
    description: 'IDs de las categorías a las que pertenece el producto', 
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String] 
  })
  @IsArray()
  @IsUUID('all', { each: true, message: 'Cada ID de categoría debe ser un UUID válido' })
  @IsOptional()
  categoryIds?: string[];

  @ApiPropertyOptional({ 
    description: 'Imágenes del producto', 
    type: [CreateProductImageDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  @IsOptional()
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({ 
    description: 'Variantes del producto', 
    type: [CreateProductVariantDto] 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @IsOptional()
  variants?: CreateProductVariantDto[];
}
