import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto & {
        password?: string;
    }): Promise<User>;
    remove(id: string): Promise<void>;
    validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null>;
    setRefreshToken(userId: string, refreshToken: string): Promise<void>;
    removeRefreshToken(userId: string): Promise<void>;
}
