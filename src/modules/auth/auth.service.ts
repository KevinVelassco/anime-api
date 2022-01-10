import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import appConfig from '../../config/app.config';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt-payload.type';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail({ email });

    const checkPassword = await user.checkPassword(password);

    if (user && checkPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  public login(user: User): Tokens {
    return this.getTokens(user);
  }

  public refreshTokens(user: User): Tokens {
    return this.getTokens(user);
  }

  public getTokens(user: User): Tokens {
    const payload: JwtPayload = { authUid: user.uid, name: user.name };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfiguration.app.accessTokenSecret,
      expiresIn: this.appConfiguration.app.accessTokenExpiration
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfiguration.app.refreshTokenSecret,
      expiresIn: this.appConfiguration.app.refreshTokenExpiration
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    };
  }
}
