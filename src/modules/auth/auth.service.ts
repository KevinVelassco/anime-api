import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import appConfig from '../../config/app.config';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt-payload.type';
import { Tokens } from './types/tokens.type';
import { ChangeAuthPasswordInput } from './dto/change-auth-password-input.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  public async login(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  public async refreshTokens(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  public getTokens(user: User): Tokens {
    const payload: JwtPayload = { authUid: user.authUid, name: user.name };

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

  public async changePassword(
    user: User,
    changeAuthPasswordInput: ChangeAuthPasswordInput
  ): Promise<Object> {
    const { authUid, email } = changeAuthPasswordInput;

    if (authUid !== user.authUid)
      throw new ConflictException('invalid authUid.');

    if (email !== user.email) throw new ConflictException('invalid email.');

    const existing = await this.userService.getUserByAuthUidAndEmail({
      authUid,
      email,
      checkIfExists: true
    });

    const { oldPassword } = changeAuthPasswordInput;

    const isValidPassword = await existing.checkPassword(oldPassword);

    if (!isValidPassword) {
      throw new ConflictException('old password is invalid.');
    }

    const { newPassword } = changeAuthPasswordInput;

    const isSameOldPassword = await existing.checkPassword(newPassword);

    if (isSameOldPassword) {
      throw new ConflictException(
        'the new password must be different from the old one.'
      );
    }

    const preloaded = await this.userRepository.preload({
      id: existing.id,
      password: newPassword
    });

    await this.userRepository.save(preloaded);

    return { message: 'password changed successfully.' };
  }
}
