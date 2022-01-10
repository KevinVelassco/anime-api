import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh.guard';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request): Tokens {
    const user = req.user as User;
    return this.authService.refreshTokens(user);
  }
}
