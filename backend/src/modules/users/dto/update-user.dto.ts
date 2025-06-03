import { PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  passwordResetToken?: string;

  @IsOptional()
  passwordResetExpires?: Date;

  @IsOptional()
  @IsString()
  emailVerificationToken?: string;

  @IsOptional()
  emailVerifiedAt?: Date;
}
