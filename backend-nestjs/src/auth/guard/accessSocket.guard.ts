// jwt-socket.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSocketGuard extends AuthGuard('jwt-socket') {
  canActivate(context: ExecutionContext) {
    // Bắt đầu xác thực như bình thường
    console.log("asdasd");
    
    return super.canActivate(context);
  }

//   handleRequest(err, user, info) {
//     if (err || !user) {
//       throw err || new UnauthorizedException();
//     }
//     return user;
//   }
}
