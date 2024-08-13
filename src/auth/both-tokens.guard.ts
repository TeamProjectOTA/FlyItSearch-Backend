import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class BothTokensGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService, 
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    try {
      await this.authService.verifyBothToken(headers);
      return true; 
    } catch (error) {
      throw new UnauthorizedException(); 
    }
  }
}
