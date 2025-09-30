import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserNotificationDto } from './dto/create-user-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async createUserNotification(createUserNotificationDto: createUserNotificationDto) {
        return this.prisma.userNotification.create({
            data: {
                ...createUserNotificationDto,
                user_id: createUserNotificationDto.user_id,
            },
        });
    }

    async getUserNotifications(userId: number, isRead?: boolean) {
        return this.prisma.userNotification.findMany({
            where: {
                user_id: userId,
                is_read: isRead,
            },
            orderBy: { created_at: 'desc' },
            include: {
                user: true,
            },
        });
    }

    async markUserNotificationAsRead(id: number) {
        return this.prisma.userNotification.update({
            where: { id },
            data: { is_read: true },
        });
    }

    async markAllUserNotificationsAsRead(userId: number) {
        return this.prisma.userNotification.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true },
        });
    }
}
