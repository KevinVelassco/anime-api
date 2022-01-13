import { Controller, Post, UseGuards } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh.guard';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Tokens } from './types/tokens.type';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@GetCurrentUser() user: User): Promise<Tokens> {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshTokens(@GetCurrentUser() user: User): Promise<Tokens> {
    return this.authService.refreshTokens(user);
  }
}
