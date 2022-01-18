import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { User } from '../../../modules/user/user.entity';
import { UserService } from '../../../modules/user/user.service';
import appConfig from '../../../config/app.config';

@Injectable()
export class JwtVerifyStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify'
) {
  constructor(
    @Inject(appConfig.KEY) configService: ConfigType<typeof appConfig>,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.app.accessTokenSecret
    });
  }

  async validate(payload: any) {
    const { authUid } = payload;

    const existingUser = await this.userService.findOne({ authUid });

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const { password, ...user } = existingUser;

    return user as User;
  }
}
