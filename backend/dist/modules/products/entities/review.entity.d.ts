import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';
export declare enum ReviewStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Review {
    id: string;
    title: string;
    content: string;
    rating: number;
    pros: string | null;
    cons: string | null;
    status: ReviewStatus;
    isVerifiedPurchase: boolean;
    helpfulVotes: number;
    unhelpfulVotes: number;
    product: Product;
    productId: string;
    user: User;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    markHelpful(): void;
    markUnhelpful(): void;
    approve(): void;
    reject(): void;
    isApproved(): boolean;
    getHelpfulPercentage(): number;
}
