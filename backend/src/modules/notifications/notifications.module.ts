import { Module } from '@nestjs/common';
import { CleanersModule } from '../cleaners/cleaners.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
    imports: [AuthModule, CleanersModule],
    controllers: [NotificationsController],
    providers: [NotificationsService, PrismaService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
