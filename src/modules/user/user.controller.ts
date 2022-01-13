import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserInput } from './dto/create-user-input.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Admin } from '../../common/decorators/admin.decorator';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { FindAllUsersInput } from './dto/find-all-users-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Admin()
  @Get()
  findAll(@Query() findAllUsersInput: FindAllUsersInput): Promise<any> {
    return this.userService.findAll(findAllUsersInput);
  }

  @Get(':authUid')
  findOne(@Param() findOneUserInput: FindOneUserInput): Promise<User | null> {
    return this.userService.findOne(findOneUserInput);
  }

  @Admin()
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Put(':authUid')
  update(
    @Param() findOneUserInput: FindOneUserInput,
    @Body() updateUserInput: UpdateUserInput
  ): Promise<User> {
    return this.userService.update(findOneUserInput, updateUserInput);
  }

  @Admin()
  @Delete(':authUid')
  delete(@Param() findOneUserInput: FindOneUserInput): Promise<User> {
    return this.userService.delete(findOneUserInput);
  }
}
