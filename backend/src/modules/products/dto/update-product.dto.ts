import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductImageDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsOptional()
  order?: number;
}

export class UpdateProductVariantDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  value?: string;

  @IsString()
  @IsOptional()
  colorCode?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsOptional()
  priceAdjustment?: number;

  @IsOptional()
  stock?: number;

  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIdsToAdd?: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIdsToRemove?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  @IsOptional()
  imagesToAdd?: UpdateProductImageDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageIdsToRemove?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  @IsOptional()
  variantsToAdd?: UpdateProductVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductVariantDto)
  @IsOptional()
  variantsToUpdate?: UpdateProductVariantDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variantIdsToRemove?: string[];
}
