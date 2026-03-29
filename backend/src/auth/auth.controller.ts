import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name?: string, password?: string }) {
    return this.authService.register(body.name || '', body.password || '');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { name?: string, password?: string }) {
    return this.authService.login(body.name || '', body.password || '');
  }
}
