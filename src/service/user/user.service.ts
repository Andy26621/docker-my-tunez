import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAuthDto } from 'src/dto/register-auth.dto';
import { UserEntity } from 'src/persistence/entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, 'postgres')
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(data: RegisterAuthDto) {
    const { password } = data;
    const passHashed: string = await hash(password, 10);
    const result = await this.userRepository.save({
      email: data.email,
      fullName: data.full_name,
      password: passHashed,
    });
    return result;
  }

  async getAll() {
    return await this.userRepository.find();
  }

  async getAdmins() {
    return await this.userRepository.find({
      where: {
        isAdmin: true,
      },
    });
  }

  async getClients() {
    return await this.userRepository.find({
      where: {
        isAdmin: false,
      },
    });
  }
}
