import { ApiProperty } from '@nestjs/swagger';
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

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de acceso JWT' })
  accessToken: string;

  @ApiProperty({ description: 'Token de actualización JWT' })
  refreshToken: string;

  @ApiProperty({ description: 'Datos del usuario autenticado' })
  user: UserResponse;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
