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
exports.Review = exports.ReviewStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const product_entity_1 = require("./product.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
let Review = class Review {
    markHelpful() {
        this.helpfulVotes += 1;
    }
    markUnhelpful() {
        this.unhelpfulVotes += 1;
    }
    approve() {
        this.status = ReviewStatus.APPROVED;
    }
    reject() {
        this.status = ReviewStatus.REJECTED;
    }
    isApproved() {
        return this.status === ReviewStatus.APPROVED;
    }
    getHelpfulPercentage() {
        const totalVotes = this.helpfulVotes + this.unhelpfulVotes;
        if (totalVotes === 0)
            return 0;
        return Math.round((this.helpfulVotes / totalVotes) * 100);
    }
};
exports.Review = Review;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la reseña', example: '123e4567-e89b-12d3-a456-426614174000' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la reseña', example: 'Excelente producto' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Contenido detallado de la reseña', example: 'El producto superó mis expectativas...' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Review.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Calificación (1-5 estrellas)',
        example: 5,
        minimum: 1,
        maximum: 5
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ventajas del producto', example: 'Buena calidad, fácil de usar' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Review.prototype, "pros", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Desventajas del producto', example: 'El color es un poco diferente al de la foto' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Review.prototype, "cons", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la reseña',
        enum: ReviewStatus,
        enumName: 'ReviewStatus',
        example: ReviewStatus.APPROVED
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.PENDING
    }),
    __metadata("design:type", String)
], Review.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Indica si la reseña fue escrita por un comprador verificado', example: true }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isVerifiedPurchase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de votos útiles', example: 12 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "helpfulVotes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de votos no útiles', example: 2 }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "unhelpfulVotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product, (product) => product.reviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'productId' }),
    __metadata("design:type", product_entity_1.Product)
], Review.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Review.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.reviews, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Review.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
exports.Review = Review = __decorate([
    (0, typeorm_1.Entity)('reviews'),
    (0, typeorm_1.Index)(['productId', 'userId'], { unique: true })
], Review);
//# sourceMappingURL=review.entity.js.map