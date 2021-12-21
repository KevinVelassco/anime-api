import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserInput } from './dto/create-user-input.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Admin } from '../../common/decorators/admin.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Admin()
  @Post()
  create(@Body() createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }
}
