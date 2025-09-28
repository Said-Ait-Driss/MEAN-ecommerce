import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailService } from '../email/email.service';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
        }),
        PrismaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, EmailService],
    exports: [AuthService],
})
export class AuthModule {}
