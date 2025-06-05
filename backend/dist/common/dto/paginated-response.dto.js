"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("./pagination.dto");
class PaginatedResponseDto {
    constructor(items, totalItems, paginationDto) {
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
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lista de ítems' }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Metadatos de paginación' }),
    __metadata("design:type", pagination_dto_1.PaginationMetaDto)
], PaginatedResponseDto.prototype, "meta", void 0);
//# sourceMappingURL=paginated-response.dto.js.map