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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: createUserDto.email.toLowerCase() }
        });
        if (existingUser) {
            throw new common_1.ConflictException('El correo electrónico ya está en uso');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            email: createUserDto.email.toLowerCase(),
            emailVerificationToken: (0, uuid_1.v4)(),
        });
        try {
            return await this.usersRepository.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('El correo electrónico ya está en uso');
            }
            throw new common_1.InternalServerErrorException('Error al crear el usuario');
        }
    }
    async findAll() {
        return this.usersRepository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email: email.toLowerCase() },
        });
    }
    async update(id, updateUserDto) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.findByEmail(updateUserDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('El correo electrónico ya está en uso');
            }
            updateUserDto.email = updateUserDto.email.toLowerCase();
        }
        const password = updateUserDto.password;
        if (password) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);
        }
        Object.assign(user, updateUserDto);
        try {
            return await this.usersRepository.save(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('El correo electrónico ya está en uso');
            }
            throw new common_1.InternalServerErrorException('Error al actualizar el usuario');
        }
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({
            where: { email: email.toLowerCase() },
            select: ['id', 'email', 'password', 'role', 'isActive', 'firstName', 'lastName'],
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async setRefreshToken(userId, refreshToken) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${userId}" no encontrado`);
        }
        user.refreshToken = refreshToken;
        await this.usersRepository.save(user);
    }
    async removeRefreshToken(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${userId}" no encontrado`);
        }
        user.refreshToken = null;
        await this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map