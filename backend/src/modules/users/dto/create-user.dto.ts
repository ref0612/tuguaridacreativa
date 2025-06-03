import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña (mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial)',
  })
  @IsString()
  @MinLength(8)
  @Matches(passwordRegEx, {
    message: `La contraseña debe contener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial`,
  })
  password: string;

  @ApiProperty({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    description: 'Rol del usuario',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.CUSTOMER;

  @ApiProperty({ required: false, default: true, description: 'Indica si el usuario está activo' })
  @IsOptional()
  isActive?: boolean = true;
}
