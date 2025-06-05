import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: 'Nombre de la categoría', 
    example: 'Pinturas' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
  name: string;

  @ApiProperty({ 
    description: 'Slug único para URLs amigables', 
    example: 'pinturas' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El slug es requerido' })
  slug: string;

  @ApiPropertyOptional({ 
    description: 'Descripción de la categoría', 
    example: 'Materiales de pintura para artistas' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ 
    description: 'URL de la imagen de la categoría', 
    example: 'https://example.com/images/pinturas.jpg' 
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ 
    description: 'ID de la categoría padre (para subcategorías)', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ 
    description: 'Orden de visualización', 
    example: 1,
    default: 0 
  })
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ 
    description: 'Indica si la categoría está activa', 
    example: true,
    default: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Indica si la categoría está destacada', 
    example: false,
    default: false 
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
