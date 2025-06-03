"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const auth_response_dto_1 = require("./dto/auth-response.dto");
const user_entity_1 = require("../users/entities/user.entity");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersRepository, usersService, jwtService, configService) {
        this.usersRepository = usersRepository;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Usuario inactivo. Por favor, contacte al administrador.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        return this.generateAuthResponse(user);
    }
    async register(createUserDto) {
        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new common_1.BadRequestException('El correo electrónico ya está en uso');
        }
        const user = await this.usersService.create(createUserDto);
        return this.generateAuthResponse(user);
    }
    async refreshToken(user) {
        return this.generateAuthResponse(user);
    }
    async generateAuthResponse(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);
        await this.usersRepository.update(user.id, { refreshToken });
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
        return new auth_response_dto_1.AuthResponseDto({
            accessToken,
            refreshToken,
            user: userResponse,
        });
    }
    async generateAccessToken(payload) {
        const expiresIn = this.configService.get('jwt.expiresIn', '1h');
        return this.jwtService.signAsync(payload, { expiresIn });
    }
    async generateRefreshToken(payload) {
        const expiresIn = this.configService.get('jwt.refreshExpiresIn', '7d');
        return this.jwtService.signAsync({ ...payload, refresh: true }, { expiresIn, secret: this.configService.get('jwt.refreshSecret') });
    }
    async validateToken(token, isRefreshToken = false) {
        try {
            const secret = isRefreshToken
                ? this.configService.get('jwt.refreshSecret')
                : this.configService.get('jwt.secret');
            const payload = await this.jwtService.verifyAsync(token, { secret });
            if (isRefreshToken && !payload.refresh) {
                throw new common_1.UnauthorizedException('Token de actualización inválido');
            }
            return payload;
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Token expirado');
            }
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
    async validateJwtPayload(payload) {
        const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Usuario no encontrado o inactivo');
        }
        return user;
    }
    async logout(userId) {
        await this.usersRepository.update(userId, { refreshToken: null });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map