import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UsersModule } from './modules/users/users.module';
import storageConfig from './config/storage.config';
import { StorageModule } from '@squareboat/nest-storage';
import { FilesModule } from './modules/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmailModule } from './modules/email/email.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        NotificationsModule,
        UsersModule,
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            load: [storageConfig],
        }),
        StorageModule.registerAsync({
            imports: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const filesystem = config.get('filesystem');
                if (!filesystem) {
                    throw new Error('Filesystem config is missing!');
                }
                return filesystem;
            },
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads', // route prefix
        }),
        FilesModule,
        EmailModule,
    ],

    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
