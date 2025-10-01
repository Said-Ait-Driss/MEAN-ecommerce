import { Controller, Post, Body, Res, HttpStatus, Delete, Get, UseGuards, Req, Patch, Param, Query, BadRequestException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from './roles.decorator';
import { Role } from 'src/modules/common/enums/role.enum';
import { RolesGuard } from './guards/roles.guard';
import { User } from '../common/interfaces/user.interface';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { AuthGoogleLoginPayload, AuthGoogleSignUpPayload } from './dto/google.dto';

@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Get('/check/:email')
    checkIfEmailIsExists(@Param('email') email: string) {
        return this.auth.checkIfEmailIsExists(email);
    }

    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.auth.register(body);
    }

    @Post('login')
    login(@Body() body: LoginDto, @Res() res: Response) {
        return this.auth.login(body, res);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('token');
        return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    }

    @Delete('delete')
    async delete(@Body('email') email: string, @Res() res: Response) {
        const result = await this.auth.delete(email);
        if (result) {
            return res.status(HttpStatus.OK).json({ message: 'User deleted successfully' });
        } else {
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'User not found' });
        }
    }

    @Get('profile')
    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    async getProfile(@Req() req: Request & { user: User }, @Res() res: Response) {
        const user = req.user;
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
        return res.status(HttpStatus.OK).json(new UserDto(user).toProfile());
    }

    // update password
    @Patch('/password/update')
    @UseGuards(RolesGuard)
    @Roles(Role.USER)
    async updatePassword(@Req() req: Request & { user: User }, @Body() updatePasswordDto: UpdatePasswordDto, @Res() res: Response) {
        const user = req.user;
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
        const userId = user.id;
        const isUpdated = await this.auth.updatePassword(userId, updatePasswordDto.currentPassword, updatePasswordDto.newPassword);
        if (isUpdated) {
            return res.status(HttpStatus.OK).json({ message: 'Password updated successfully' });
        } else {
            return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Current password is incorrect' });
        }
    }

    // email verifications
    @Post('verify-email/initiate')
    async initiateEmailVerification(@Body('email') email: string) {
        if (!email) {
            throw new BadRequestException('Email is required');
        }
        return this.auth.initiateEmailVerification(email);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.auth.verifyEmail(token);
    }

    @Post('resend-verification')
    async resendVerification(@Body() resendDto: ResendVerificationDto) {
        return this.auth.resendVerificationEmail(resendDto.email);
    }

    // google
    @Post('google/register')
    @HttpCode(HttpStatus.OK)
    public async googleRegister(@Body() payload: AuthGoogleSignUpPayload): Promise<any> {
        return this.auth.verifyGoogleRegister(payload);
    }

    @Post('google/login')
    @HttpCode(HttpStatus.OK)
    public async googleLogin(@Body() payload: AuthGoogleSignUpPayload, @Res() res: Response): Promise<any> {
        return this.auth.verifyGoogleLogin(payload, res);
    }
}
