import { UserRole } from '../../users/enums/user-role.enum';
interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    emailVerifiedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
    constructor(partial: Partial<AuthResponseDto>);
}
export {};
