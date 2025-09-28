import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ALLOWED_ORIGINS } from 'src/main';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
    cors: { origin: 'http://192.168.1.9:5173', credentials: true },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private connectedUsers: Map<string, string> = new Map();

    handleConnection(client: Socket) {
        // const userId: any = client.handshake.query.userId;
        // if (userId) {
        //     this.connectedUsers.set(userId, client.id);
        //     console.log(`User ${userId} connected`);
        // }

        try {
            // Parse cookies
            const cookies = cookie.parse(client.handshake.headers.cookie || '');
            const token = cookies['token']; // the cookie name you set in NestJS

            if (!token) {
                console.log('❌ No token found in cookies');
                return client.disconnect();
            }

            // Verify JWT
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

            const userId = decoded.sub;

            this.connectedUsers.set(userId, client.id);
            console.log(`✅ User ${userId} connected with socket ${client.id}`);
        } catch (err) {
            console.log('❌ Invalid socket auth');
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        for (const [userId, socketId] of this.connectedUsers.entries()) {
            if (socketId === client.id) {
                this.connectedUsers.delete(userId);
                console.log(`🔌 User ${userId} disconnected`);
            }
        }
    }

    sendNotification(userId: string, payload: any) {
        const socketId = this.connectedUsers.get(userId);
        console.log('socket id : ', socketId);

        if (socketId) {
            this.server.to(socketId).emit('notification', payload);
        }
    }
}
