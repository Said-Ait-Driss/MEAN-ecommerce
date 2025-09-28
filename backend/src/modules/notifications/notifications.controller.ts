import { Controller, Get, Post, Param, Patch, Query, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { createUserNotificationDto } from './dto/create-user-notification.dto';
import { createCleanerNotificationDto } from './dto/create-cleaner-notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('user')
    createUserNotification(@Body() createUserNotificationDto: createUserNotificationDto) {
        return this.notificationsService.createUserNotification(createUserNotificationDto);
    }

    @Post('cleaner')
    createCleanerNotification(@Body() createCleanerNotificationDto: createCleanerNotificationDto) {
        return this.notificationsService.createCleanerNotification(createCleanerNotificationDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get('user')
    getUserNotifications(@Req() req, @Query('read') read?: boolean) {
        const userId = req.user.id;
        return this.notificationsService.getUserNotifications(userId, read);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.CLEANER)
    @Get('cleaner')
    getCleanerNotifications(@Req() req, @Query('read') read?: boolean) {
        const cleanerId = req.user.id;
        return this.notificationsService.getCleanerNotifications(cleanerId, read);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Patch('user/read-all')
    markAllUserNotificationsAsRead(@Req() req) {
        const userId = req.user.id;
        return this.notificationsService.markAllUserNotificationsAsRead(userId);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.CLEANER)
    @Patch('cleaner/read-all')
    markAllCleanerNotificationsAsRead(@Req() req) {
        const cleanerId = req.user.id;
        return this.notificationsService.markAllCleanerNotificationsAsRead(cleanerId);
    }
}
