import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../enums/user-role.enum';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "password">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    role?: UserRole;
    isActive?: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    emailVerificationToken?: string;
    emailVerifiedAt?: Date;
}
export {};
