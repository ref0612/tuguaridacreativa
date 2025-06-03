import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el correo ya está en uso
    const existingUser = await this.usersRepository.findOne({ 
      where: { email: createUserDto.email.toLowerCase() } 
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Crear el usuario
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      email: createUserDto.email.toLowerCase(),
      emailVerificationToken: uuidv4(),
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Código de error de violación de restricción única
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto & { password?: string }): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    // Si se está actualizando el correo, verificar que no esté en uso
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      updateUserDto.email = updateUserDto.email.toLowerCase();
    }

    // Si se está actualizando la contraseña, hashearla
    const password = (updateUserDto as any).password;
    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    Object.assign(user, updateUserDto);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
  }

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({ 
      where: { email: email.toLowerCase() },
      select: ['id', 'email', 'password', 'role', 'isActive', 'firstName', 'lastName'],
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as User;
    }

    return null;
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado`);
    }
    
    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado`);
    }
    
    user.refreshToken = null as any; // We know this is safe because the column is nullable
    await this.usersRepository.save(user);
  }
}
