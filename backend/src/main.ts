import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

export const ALLOWED_ORIGINS = ['*', 'http://172.17.0.1:5173', 'http://localhost:5173', 'http://192.168.1.9', 'http://192.168.1.9:5173'];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable cookie parsing
    app.use(cookieParser());

    // Enable CORS
    app.enableCors({
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'X-Requested-With', 'baggage', 'sentry-trace', 'x-api-key'],
    });

    // Enable global validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Remove non-whitelisted properties
            forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
            transform: true, // Auto-transform payloads to DTO instances
        }),
    );

    await app.listen(process.env.PORT ?? 8001, '0.0.0.0', async () => {
        console.log(`Application is running on: ${await app.getUrl()}`);
    });
}
bootstrap();
