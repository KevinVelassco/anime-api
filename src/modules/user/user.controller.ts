import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserInput } from './dtos/create-user-input.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }
}
