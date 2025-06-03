import { UserRole } from '../enums/user-role.enum';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    emailVerifiedAt: Date;
    emailVerificationToken: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
    createdAt: Date;
    updatedAt: Date;
    refreshToken?: string;
    emailToLowerCase(): void;
    constructor(partial: Partial<User>);
}
