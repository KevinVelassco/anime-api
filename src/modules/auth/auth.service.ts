import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail({ email });

    if (user && user.checkPassword(password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  login(user: User) {
    const payload = { authUid: user.uid, name: user.name };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
