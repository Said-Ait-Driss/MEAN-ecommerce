import { Controller, Get, Post, Patch, Query, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { createUserNotificationDto } from './dto/create-user-notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('user')
    createUserNotification(@Body() createUserNotificationDto: createUserNotificationDto) {
        return this.notificationsService.createUserNotification(createUserNotificationDto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Get('user')
    getUserNotifications(@Req() req, @Query('read') read?: boolean) {
        const userId = req.user.id;
        return this.notificationsService.getUserNotifications(userId, read);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    @Patch('user/read-all')
    markAllUserNotificationsAsRead(@Req() req) {
        const userId = req.user.id;
        return this.notificationsService.markAllUserNotificationsAsRead(userId);
    }
}
