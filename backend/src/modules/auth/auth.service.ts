import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password' | 'emailToLowerCase'>> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Usuario inactivo. Por favor, contacte al administrador.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return this.generateAuthResponse(user as User);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    // Verificar si el correo ya está en uso
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso');
    }

    // Crear el usuario
    const user = await this.usersService.create(createUserDto);
    
    // Generar tokens de autenticación
    return this.generateAuthResponse(user);
  }

  async refreshToken(user: User): Promise<AuthResponseDto> {
    return this.generateAuthResponse(user);
  }

  private async generateAuthResponse(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    // Actualizar el refresh token en la base de datos
    await this.usersRepository.update(user.id, { refreshToken });

    // Crear un objeto de usuario sin información sensible para la respuesta
    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return new AuthResponseDto({
      accessToken,
      refreshToken,
      user: userResponse,
    });
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.expiresIn', '1h');
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const expiresIn = this.configService.get<string>('jwt.refreshExpiresIn', '7d');
    return this.jwtService.signAsync(
      { ...payload, refresh: true },
      { expiresIn, secret: this.configService.get<string>('jwt.refreshSecret') },
    );
  }

  async validateToken(token: string, isRefreshToken = false): Promise<JwtPayload> {
    try {
      const secret = isRefreshToken 
        ? this.configService.get<string>('jwt.refreshSecret')
        : this.configService.get<string>('jwt.secret');
      
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
      
      if (isRefreshToken && !payload.refresh) {
        throw new UnauthorizedException('Token de actualización inválido');
      }
      
      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      throw new UnauthorizedException('Token inválido');
    }
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }
    return user;
  }

  async logout(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: null as any });
  }
}
