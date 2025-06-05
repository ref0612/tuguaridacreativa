import { PaginationMetaDto } from './pagination.dto';
export declare class PaginatedResponseDto<T> {
    items: T[];
    meta: PaginationMetaDto;
    constructor(items: T[], totalItems: number, paginationDto: any);
}
