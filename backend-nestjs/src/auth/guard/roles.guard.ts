import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserJWT } from "src/types/CustomType";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { Role } from "src/constant/constant";

Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserJWT;
    return requiredRoles.some((role) => user.role === role);
  }
}