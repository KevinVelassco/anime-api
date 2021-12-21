import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../../../modules/user/user.service';
import appConfig from '../../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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

    const user = await this.userService.findOne({
      uid: authUid,
      checkIfExists: true
    });

    return user;
  }
}
