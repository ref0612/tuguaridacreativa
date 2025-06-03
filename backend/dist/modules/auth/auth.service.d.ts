import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthService {
    private usersRepository;
    private usersService;
    private jwtService;
    private configService;
    constructor(usersRepository: Repository<User>, usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<Omit<User, 'password' | 'emailToLowerCase'>>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    refreshToken(user: User): Promise<AuthResponseDto>;
    private generateAuthResponse;
    private generateAccessToken;
    private generateRefreshToken;
    validateToken(token: string, isRefreshToken?: boolean): Promise<JwtPayload>;
    validateJwtPayload(payload: JwtPayload): Promise<User>;
    logout(userId: string): Promise<void>;
}
