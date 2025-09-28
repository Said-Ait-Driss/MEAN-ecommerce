import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from 'src/modules/common/enums/role.enum';
import * as crypto from 'crypto';
import { InvalidRoleException } from './exceptions/invalid-role.exception';
import { CleanerAlreadyExistsException } from './exceptions/cleaner-already-exists';
import { UserAlreadyExistsException } from './exceptions/user-already-exists';
import { InvalidCredentialsException } from './exceptions/invalid_credentials.exception';
import { EmailNotVerifiedException } from './exceptions/email-not-verified.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { EmailService } from '../email/email.service';
import { UserAlreadyVerifiedException } from './exceptions/user-already-verified';
import { google } from 'googleapis';
import { AuthGoogleLoginPayload, AuthGoogleSignUpPayload } from './dto/google.dto';
import { AuthErrorException } from './exceptions/auth-error.exception';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private emailService: EmailService,
    ) {}

    public generateSalt(byteSize = 16): string {
        return crypto.randomBytes(byteSize).toString('base64');
    }

    public encryptPassword(pw: string, salt: string): string {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;

        return crypto.pbkdf2Sync(pw, salt, defaultIterations, defaultKeyLength, 'sha1').toString('base64');
    }

    public verifyPassword(pw: string, user: any): boolean {
        if (!pw || !user || !user.salt) {
            return false;
        }
        return this.encryptPassword(pw, user.salt) === user.password_hash;
    }

    async register(dto: RegisterDto) {
        if (dto.role && ![Role.USER, Role.CLEANER].includes(dto.role)) {
            throw new InvalidRoleException();
        }

        const salt = this.generateSalt();
        const hashed = this.encryptPassword(dto.password, salt);

        const existingUser = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { phone: dto.phone }] } });
        const existingCleaner = await this.prisma.cleaner.findFirst({ where: { OR: [{ email: dto.email }, { phone: dto.phone }] } });

        if (existingCleaner) {
            throw new CleanerAlreadyExistsException();
        }
        if (existingUser) {
            throw new UserAlreadyExistsException();
        }

        // Generate email verification token if email is provided
        let emailVerificationToken;
        let emailVerificationExpires;

        if (dto.email) {
            emailVerificationToken = crypto.randomBytes(32).toString('hex');
            emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
        }

        // Create a cleaner if the role is CLEANER
        if (dto.role === Role.CLEANER) {
            const cleaner = await this.prisma.cleaner.create({
                data: {
                    email: dto.email,
                    password_hash: hashed,
                    salt,
                    full_name: dto.fullName,
                    phone: dto.phone,
                    phone_code: dto.phoneCode,
                    date_of_birth: dto.dateOfBirth,
                    photo_url: 'uploads/cleaners/cleaner-woman.jpg',
                    email_verification_token: emailVerificationToken,
                    email_verification_expires: emailVerificationExpires,
                },
            });
            const emailresult = await this.emailService.sendVerificationEmail(dto.email, emailVerificationToken, dto.role);
            if (emailresult.success) {
                return { id: cleaner.id, email: cleaner.email, role: dto.role, is_verified: false, email_sent: true };
            } else {
                return { id: cleaner.id, email: cleaner.email, role: dto.role, is_verified: false, email_sent: false };
            }
        }
        // Create a user if the role is USER
        if (dto.role === Role.USER) {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password_hash: hashed,
                    salt,
                    full_name: dto.fullName,
                    phone: dto.phone,
                    phone_code: dto.phoneCode,
                    date_of_birth: dto.dateOfBirth,
                    address: dto.address,
                    photo_url: 'uploads/users/default-avatar-profile.jpg',
                    email_verification_token: emailVerificationToken,
                    email_verification_expires: emailVerificationExpires,
                },
            });
            // Send verification email if email is provided
            const emailresult = await this.emailService.sendVerificationEmail(dto.email, emailVerificationToken, dto.role);
            console.log(emailresult.success);
            console.log(emailresult.error);

            if (emailresult.success) {
                return { id: user.id, email: user.email, role: dto.role, is_verified: false, email_sent: true };
            } else {
                return { id: user.id, email: user.email, role: dto.role, is_verified: false, email_sent: false };
            }
        }
    }

    async checkIfEmailIsExists(email: string) {
        const existingUser = await this.prisma.user.findFirst({ where: { email: email } });
        const existingCleaner = await this.prisma.cleaner.findFirst({ where: { email: email } });

        if (existingCleaner || existingUser) {
            return {
                exists: true,
            };
        }
        return {
            exists: false,
        };
    }

    async login(dto: LoginDto, res: Response) {
        // Use the user if it exists, otherwise use the cleaner
        let userToAuthenticate;
        if (dto.role === Role.CLEANER) {
            userToAuthenticate = await this.prisma.cleaner.findUnique({ where: { email: dto.email } });
        } else {
            userToAuthenticate = await this.prisma.user.findUnique({ where: { email: dto.email } });
        }

        // If neither user nor cleaner exists, throw an error
        if (!userToAuthenticate) {
            throw new InvalidCredentialsException();
        }

        // Check if the password matches
        if (!userToAuthenticate || !this.verifyPassword(dto.password, userToAuthenticate)) {
            throw new InvalidCredentialsException();
        }

        if (!userToAuthenticate.is_verified) {
            throw new EmailNotVerifiedException();
        }

        // Generate JWT token
        const payload = { sub: userToAuthenticate.id, role: Role.USER };
        if (dto.role === Role.CLEANER) {
            payload.role = Role.CLEANER;
        }

        const token = this.jwt.sign(payload);

        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'none',
            secure: false, // because dev is not HTTPS
            sameSite: 'lax', // works in dev (unless you strictly need cross-site)
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        const data = { id: userToAuthenticate.id, email: userToAuthenticate.email, role: Role.USER };

        if (dto.role === Role.CLEANER) {
            data.role = Role.CLEANER;
        }

        return res.status(200).json({ message: 'Login successful', data });
    }

    async delete(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (user) {
            await this.prisma.user.delete({ where: { email } });
            return true;
        }
        const cleaner = await this.prisma.cleaner.findUnique({ where: { email } });
        if (cleaner) {
            await this.prisma.cleaner.delete({ where: { email } });
            return true;
        }
        return false;
    }
    async verifyJWT(token: string): Promise<any> {
        try {
            return this.jwt.verify(token, { secret: process.env.JWT_SECRET });
        } catch (error) {
            return null;
        }
    }

    async getSourceFromJWT(token: string): Promise<any> {
        const decoded = await this.verifyJWT(token);
        if (!decoded) {
            throw new UnauthorizedException('Invalid token');
        }
        const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
        if (user) {
            return { ...user, role: Role.USER };
        }
        const cleaner = await this.prisma.cleaner.findUnique({ where: { id: decoded.sub } });
        if (cleaner) {
            return { ...cleaner, role: Role.CLEANER };
        }
        throw new UnauthorizedException('User not found');
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string, role: Role): Promise<boolean> {
        // Find the user based on role
        let user;
        if (role === Role.CLEANER) {
            user = await this.prisma.cleaner.findUnique({ where: { id: userId } });
        } else if (role === Role.USER) {
            user = await this.prisma.user.findUnique({ where: { id: userId } });
        } else {
            throw new InvalidRoleException();
        }

        // Check if user exists
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Verify current password
        if (!this.verifyPassword(currentPassword, user)) {
            throw new InvalidCredentialsException();
        }

        // Generate new salt and hash for the new password
        const newSalt = this.generateSalt();
        const newHashedPassword = this.encryptPassword(newPassword, newSalt);

        // Update the password in the database based on role
        if (role === Role.CLEANER) {
            await this.prisma.cleaner.update({
                where: { id: userId },
                data: {
                    password_hash: newHashedPassword,
                    salt: newSalt,
                    updated_at: new Date(),
                },
            });
        } else if (role === Role.USER) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    password_hash: newHashedPassword,
                    salt: newSalt,
                    updated_at: new Date(),
                },
            });
        }

        return true;
    }

    // email verification
    async initiateEmailVerification(email: string, isCleaner: boolean = false) {
        // Generate verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Find user or cleaner
        let user, cleaner;
        if (isCleaner) {
            cleaner = await this.prisma.cleaner.findUnique({ where: { email } });
            if (!cleaner) {
                throw new UserNotFoundException();
            }
            if (cleaner.is_verified) {
                throw new UserAlreadyVerifiedException();
            }

            // Update cleaner with verification token
            await this.prisma.cleaner.update({
                where: { email },
                data: {
                    email_verification_token: token,
                    email_verification_expires: expires.toISOString(),
                },
            });
        } else {
            user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new UserNotFoundException();
            }
            if (user.is_verified) {
                throw new UserAlreadyVerifiedException();
            }
            // Update user with verification token
            await this.prisma.user.update({
                where: { email },
                data: {
                    email_verification_token: token,
                    email_verification_expires: expires.toISOString(),
                },
            });
        }

        // Send verification email
        const emailSent = await this.emailService.sendVerificationEmail(email, token, isCleaner ? 'CLEANER' : 'USER');

        if (!emailSent) {
            throw new BadRequestException('Failed to send verification email');
        }

        return { message: 'Verification email sent successfully' };
    }

    async verifyEmail(token: string, userType: 'USER' | 'CLEANER' = 'USER') {
        const model: any = userType === 'USER' ? this.prisma.user : this.prisma.cleaner;

        const entity = await model.findFirst({
            where: {
                email_verification_token: token,
                email_verification_expires: {
                    gt: new Date().toISOString(),
                },
            },
        });

        if (!entity) {
            throw new InvalidCredentialsException();
        }

        // Update entity to mark email as verified
        const updatedEntity = await model.update({
            where: { id: entity.id },
            data: {
                is_verified: true,
                email_verification_token: null,
                email_verification_expires: null,
            },
            select: {
                id: true,
                full_name: true,
                email: true,
                is_verified: true,
            },
        });

        // Send welcome email
        if (entity.email) {
            await this.emailService.sendWelcomeEmail(entity.email, entity.full_name);
        }

        return {
            message: 'email-verified-successfully',
            [userType]: updatedEntity,
        };
    }

    async resendVerificationEmail(email: string, userType: 'USER' | 'CLEANER' = 'USER') {
        const model: any = userType === 'USER' ? this.prisma.user : this.prisma.cleaner;

        const entity = await model.findFirst({
            where: { email },
        });

        if (!entity) {
            throw new UserNotFoundException();
        }

        if (entity.is_email_verified) {
            throw new EmailNotVerifiedException();
        }

        // Generate new verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update entity with new token
        await model.update({
            where: { id: entity.id },
            data: {
                email_verification_token: emailVerificationToken,
                email_verification_expires: emailVerificationExpires,
            },
        });

        // Send verification email
        await this.emailService.sendVerificationEmail(email, emailVerificationToken, userType);

        return {
            message: 'verification-email-sent-successfully',
        };
    }

    // google
    public async verifyGoogleRegister(payload: AuthGoogleSignUpPayload) {
        const { accessToken, type } = payload;

        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2();

        oauth2Client.setCredentials({ access_token: accessToken });
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const res = await oauth2.userinfo.get();
        if (!res?.data) {
            throw new AuthErrorException();
        }

        const profile = res.data;
        if (!profile.email || !profile.verified_email) {
            throw new AuthErrorException();
        }

        const model: any = type === 'USER' ? this.prisma.user : this.prisma.cleaner;

        const user = await model.findUnique({
            where: {
                email: profile.email.toLowerCase(),
            },
        });

        if (user) {
            return {
                alreadySignedUp: true,
            };
        } else {
            let newAccount;
            // if (type === 'USER') {
            //     newAccount = await this.prisma.user.create({
            //         data: {
            //             email: profile.email.toLowerCase(),
            //             full_name: `${profile.given_name} ${profile.family_name}`,
            //             photo_url: profile.picture || 'uploads/cleaners/cleaner-woman.jpg',
            //             is_verified: true,
            //             google_connected: true,
            //         },
            //     });
            // } else {
            //     newAccount = await this.prisma.cleaner.create({
            //         data: {
            //             email: profile.email.toLowerCase(),
            //             full_name: `${profile.given_name} ${profile.family_name}`,
            //             photo_url: profile.picture || 'uploads/cleaners/cleaner-woman.jpg',
            //             is_verified: true,
            //             google_connected: true,
            //         },
            //     });
            // }
        }
    }

    public async verifyGoogleLogin(payload: AuthGoogleSignUpPayload, response: Response) {
        const { accessToken, type } = payload;
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });
        const res = await oauth2.userinfo.get();

        if (!res?.data) {
            throw new AuthErrorException();
        }
        const profile = res.data;
        if (!profile.email || !profile.verified_email) {
            throw new AuthErrorException();
        }
        const model: any = type === 'USER' ? this.prisma.user : this.prisma.cleaner;

        const userToAuthenticate = await model.findUnique({
            where: {
                email: profile.email.toLowerCase(),
            },
        });

        if (!userToAuthenticate) {
            throw new NotFoundException();
        }

        // Generate JWT token
        const jwtPayload = { sub: userToAuthenticate.id, role: Role.USER };
        if (type === Role.CLEANER) {
            jwtPayload.role = Role.CLEANER;
        }

        const token = this.jwt.sign(jwtPayload);

        response.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'none',
            secure: false, // because dev is not HTTPS
            sameSite: 'lax', // works in dev (unless you strictly need cross-site)
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        const data = { id: userToAuthenticate.id, email: userToAuthenticate.email, role: Role.USER };

        if (type === Role.CLEANER) {
            data.role = Role.CLEANER;
        }

        return response.status(200).json({ message: 'Login successful', data });
    }
}
