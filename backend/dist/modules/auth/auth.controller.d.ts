import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
    getProfile(req: Request): Express.User | undefined;
    refreshToken(req: Request): Promise<AuthResponseDto>;
    logout(req: Request): Promise<void>;
}
