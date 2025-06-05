import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Lista de ítems' })
  items: T[];

  @ApiProperty({ description: 'Metadatos de paginación' })
  meta: PaginationMetaDto;

  constructor(items: T[], totalItems: number, paginationDto: any) {
    this.items = items;
    this.meta = {
      totalItems,
      itemCount: items.length,
      itemsPerPage: paginationDto.limit || 10,
      totalPages: Math.ceil(totalItems / (paginationDto.limit || 10)),
      currentPage: paginationDto.page || 1,
    };
  }
}
