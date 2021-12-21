import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserInput } from './dto/create-user-input.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Admin } from '../../common/decorators/admin.decorator';
import { FindOneUserInput } from './dto/find-one-user-input.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Admin()
  @Get(':uid')
  findOne(@Param() findOneUserInput: FindOneUserInput): Promise<User | null> {
    return this.userService.findOne(findOneUserInput);
  }

  @Admin()
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }
}
