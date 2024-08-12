import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class BothTokensGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService, // Replace with your actual service name
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    try {
      await this.authService.verifyBothToken(headers);
      return true; // Access is allowed if the function does not throw
    } catch (error) {
      throw new UnauthorizedException(); // Access is denied if an exception is thrown
    }
  }
}
