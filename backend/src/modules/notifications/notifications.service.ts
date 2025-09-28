import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { createUserNotificationDto } from './dto/create-user-notification.dto';
import { createCleanerNotificationDto } from './dto/create-cleaner-notification.dto';

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

    async createCleanerNotification(createCleanerNotificationDto: createCleanerNotificationDto) {
        return this.prisma.cleanerNotification.create({
            data: {
                ...createCleanerNotificationDto,
                cleaner_id: createCleanerNotificationDto.cleaner_id,
            },
        });
    }

    async getUserNotifications(userId: string, isRead?: boolean) {
        return this.prisma.userNotification.findMany({
            where: {
                user_id: userId,
                is_read: isRead,
            },
            orderBy: { created_at: 'desc' },
            include: {
                user: true,
                booking: {
                    include: {
                        user: true,
                        cleaner: true,
                    },
                },
            },
        });
    }

    async getCleanerNotifications(cleanerId: string, isRead?: boolean) {
        return this.prisma.cleanerNotification.findMany({
            where: {
                cleaner_id: cleanerId,
                is_read: isRead,
            },
            orderBy: { created_at: 'desc' },
            include: {
                cleaner: true,
                booking: {
                    include: {
                        user: true,
                        cleaner: true,
                    },
                },
            },
        });
    }

    async markUserNotificationAsRead(id: string) {
        return this.prisma.userNotification.update({
            where: { id },
            data: { is_read: true },
        });
    }

    async markCleanerNotificationAsRead(id: string) {
        return this.prisma.cleanerNotification.update({
            where: { id },
            data: { is_read: true },
        });
    }

    async markAllUserNotificationsAsRead(userId: string) {
        return this.prisma.userNotification.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true },
        });
    }

    async markAllCleanerNotificationsAsRead(cleanerId: string) {
        return this.prisma.cleanerNotification.updateMany({
            where: { cleaner_id: cleanerId, is_read: false },
            data: { is_read: true },
        });
    }
}
