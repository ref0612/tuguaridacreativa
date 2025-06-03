import { Exclude } from 'class-transformer';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  BeforeInsert, 
  BeforeUpdate,
  Index
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @ApiProperty({ description: 'ID único del usuario' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'Correo electrónico del usuario (único)' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Contraseña del usuario (hasheada)' })
  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @ApiProperty({ 
    description: 'Rol del usuario',
    enum: UserRole,
    default: UserRole.CUSTOMER 
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @ApiProperty({ description: 'Indica si el usuario está activo' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de verificación del correo electrónico' })
  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @ApiProperty({ description: 'Token de verificación de correo electrónico' })
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  emailVerificationToken: string;

  @ApiProperty({ description: 'Token de restablecimiento de contraseña' })
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  passwordResetToken: string;

  @ApiProperty({ description: 'Fecha de expiración del token de restablecimiento' })
  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date;

  @ApiProperty({ description: 'Fecha de creación del usuario' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización del usuario' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Token de actualización para autenticación', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
