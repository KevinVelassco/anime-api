import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { JwtRefreshAuthGuard } from '../../common/guards/jwt-refresh.guard';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Tokens } from './types/tokens.type';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { ChangeAuthPasswordInput } from './dto/change-auth-password-input.dto';
import { MessageOutput } from '../../common/dto/message-output.dto';
import { SendResetAuthPasswordEmailInput } from './dto/send-reset-auth-password-email-input.dto';
import { ResetAuthPasswordInput } from './dto/reset-auth-password-input.dto';
import { ChangeAuthEmailInput } from './dto/change-auth-email-Input.dto';

@ApiTags('auth')
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

  @Put('change-password')
  changePassword(
    @GetCurrentUser() user: User,
    @Body() changeAuthPasswordInput: ChangeAuthPasswordInput
  ): Promise<MessageOutput> {
    return this.authService.changePassword(user, changeAuthPasswordInput);
  }

  @Public()
  @Post('send-reset-password-email')
  sendResetPasswordEmail(
    @Body() sendResetAuthPasswordEmailInput: SendResetAuthPasswordEmailInput
  ): Promise<MessageOutput> {
    return this.authService.sendResetPasswordEmail(
      sendResetAuthPasswordEmailInput
    );
  }

  @Public()
  @Put('reset-password')
  resetPassword(
    @Body() resetAuthPasswordInput: ResetAuthPasswordInput
  ): Promise<MessageOutput> {
    return this.authService.resetPassword(resetAuthPasswordInput);
  }

  @Put('change-email')
  changeEmail(
    @GetCurrentUser() user: User,
    @Body() changeAuthEmailInput: ChangeAuthEmailInput
  ): Promise<MessageOutput> {
    return this.authService.changeEmail(user, changeAuthEmailInput);
  }
}
