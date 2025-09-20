import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtSocketGuard } from 'src/auth/guard/accessSocket.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guard/refreshToken.guard';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
@WebSocketGateway({
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'notification',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // constructor(private readonly jwtService: JwtService) {}
  // afterInit(server: any) {
  //   server.use((socket: Socket, next: NextFunction) => {
  //     try {
  //       const token = socket.handshake.auth?.token;
  //       //   console.log(token);

  //       if (!token) {
  //         return next(new UnauthorizedException());
  //       }
  //       const payload = this.jwtService.verify(token.replace('Bearer ', ''));
  //       // Gán user info cho socket để dùng sau
  //       (socket as any).user = payload;
  //       next();
  //     } catch (err) {
  //       next(new UnauthorizedException());
  //     }
  //   });
  // }

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  // @UseGuards(JwtSocketGuard)
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    console.dir(client.handshake.auth, { depth: null });
  }

  @SubscribeMessage('joinProjectRoom')
  handleJoinProjectRooms(client: Socket, data: { roomId: string }) {
    const roomId = data.roomId;
    console.log(data);

    // console.log(`Client ${client.id} joining rooms for projects:`, projectIds);
    if (!roomId) {
      console.error('No roomId provided in the data!');
      return { event: 'error', data: 'Invalid data format' };
    }
    // Tham gia vào phòng với ID là roomId
    client.join(roomId);
    console.log(`Client ${client.id} successfully joined room: ${roomId}`);
    // Optional: Gửi lại phản hồi cho client biết đã thành công
    return {
      event: 'joinedRoom',
      data: { status: 'success', room: roomId },
    };
    // if (Array.isArray(idsToJoin)) {
    //   idsToJoin.forEach((projectId) => {
    //     client.join(projectId);
    //   });
    //   console.log(`Client ${client.id} successfully joined rooms:`, idsToJoin);
    //   // Optional: Gửi lại phản hồi cho client biết đã thành công
    //   return {
    //     event: 'joinedRooms',
    //     data: { status: 'success', rooms: idsToJoin },
    //   };
    // } else {
    //   console.error('The received projectIds is not an array!');
    //   // Optional: Gửi lại lỗi cho client
    //   return { event: 'error', data: 'Invalid data format' };
    // }
  }

  sendNotificationToProject(projectId: string, notification: any) {
    this.server.to(projectId).emit(`notification`, notification);
  }

  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(userId).emit(`notification`, notification);
  }
}
