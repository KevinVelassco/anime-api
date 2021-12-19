import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserInput } from './dto/create-user-input.dto';
import { GetUserByEmailInput } from './dto/get-user-by-email-input.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async create(createUserInput: CreateUserInput): Promise<User> {
    const { email } = createUserInput;

    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });

    if (user) {
      throw new NotFoundException(`already exists a user with email ${email}`);
    }

    const created = this.userRepository.create({
      ...createUserInput
    });

    created.hashPassword();

    const saved = await this.userRepository.save(created);

    return saved;
  }

  public async getUserByEmail(
    getUserByEmailInput: GetUserByEmailInput
  ): Promise<User | null> {
    const { email } = getUserByEmailInput;

    const user = await this.userRepository.findOne({
      where: {
        email
      }
    });

    return user || null;
  }
}
