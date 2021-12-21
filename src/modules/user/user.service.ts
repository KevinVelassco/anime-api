import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { CreateUserInput } from './dto/create-user-input.dto';
import { FindAllUsersInput } from './dto/find-all-users-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { GetUserByEmailInput } from './dto/get-user-by-email-input.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  public async findAll(findAllUsersInput: FindAllUsersInput): Promise<any> {
    const { limit = 10, skip = 0, q } = findAllUsersInput;

    let where: any;

    if (q) where = [{ name: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) }];

    const items = await this.userRepository.findAndCount({
      where,
      take: limit,
      skip,
      order: {
        id: 'DESC'
      }
    });

    return items;
  }

  public async findOne(
    findOneUserInput: FindOneUserInput
  ): Promise<User | null> {
    const { uid, checkIfExists = false } = findOneUserInput;

    const item = await this.userRepository.findOne({
      select: [
        'uid',
        'name',
        'email',
        'isAdmin',
        'createdAt',
        'updatedAt',
        'deletedAt'
      ],
      where: { uid }
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the user with uuid ${uid}.`);
    }

    return item || null;
  }

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

    const { isAdmin = false } = createUserInput;

    const created = this.userRepository.create({
      ...createUserInput,
      isAdmin
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
