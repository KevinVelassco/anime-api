import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user-input.dto';
import { FindAllUsersInput } from './dto/find-all-users-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { GetUserByEmailInput } from './dto/get-user-by-email-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';

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
      where: { uid }
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the user with uuid ${uid}.`);
    }

    return item || null;
  }

  public async create(createUserInput: CreateUserInput): Promise<User> {
    const { email } = createUserInput;

    const user = await this.getUserByEmail({ email });

    if (user) {
      throw new ConflictException(`already exists a user with email ${email}`);
    }

    const { isAdmin = false } = createUserInput;

    const created = this.userRepository.create({
      ...createUserInput,
      isAdmin
    });

    const saved = await this.userRepository.save(created);

    return saved;
  }

  public async update(
    findOneUserInput: FindOneUserInput,
    updateUserInput: UpdateUserInput
  ): Promise<User> {
    const { uid } = findOneUserInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const { email } = updateUserInput;

    if (email) {
      const user = await this.getUserByEmail({ email });

      if (user) {
        throw new ConflictException(
          `already exists a user with email ${email}`
        );
      }
    }

    const preloaded = await this.userRepository.preload({
      id: existing.id,
      ...updateUserInput
    });

    const saved = await this.userRepository.save(preloaded);
    return saved;
  }

  public async delete(findOneUserInput: FindOneUserInput): Promise<User> {
    const { uid } = findOneUserInput;

    const existing = await this.findOne({
      uid,
      checkIfExists: true
    });

    const deleted = await this.userRepository.softRemove(existing);

    return deleted;
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
