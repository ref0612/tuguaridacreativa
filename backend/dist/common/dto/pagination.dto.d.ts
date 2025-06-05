export declare class PaginationDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    get skip(): number;
    get order(): Record<string, 'ASC' | 'DESC'> | undefined;
}
export declare class PaginationMetaDto {
    totalItems: number;
    itemCount: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    constructor(totalItems: number, currentPage: number, itemsPerPage: number);
}
