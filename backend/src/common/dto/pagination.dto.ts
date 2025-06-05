import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número de página (comenzando desde 1)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de ítems por página',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar los resultados',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Término de búsqueda',
    example: 'lienzo',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // Método para obtener los parámetros de paginación para TypeORM
  get skip(): number {
    return (this.page - 1) * this.limit;
  }

  // Método para obtener los parámetros de ordenación para TypeORM
  get order(): Record<string, 'ASC' | 'DESC'> | undefined {
    if (!this.sortBy) return undefined;
    return { [this.sortBy]: this.sortOrder };
  }
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Total de ítems' })
  totalItems: number;

  @ApiProperty({ description: 'Cantidad de ítems en la página actual' })
  itemCount: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Página actual' })
  currentPage: number;

  @ApiProperty({ description: 'Cantidad de ítems por página' })
  itemsPerPage: number;

  constructor(totalItems: number, currentPage: number, itemsPerPage: number) {
    this.totalItems = totalItems;
    this.itemCount = Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage);
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
  }
}
