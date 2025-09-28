import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthGoogleLoginPayload {
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}

export class AuthGoogleSignUpPayload extends AuthGoogleLoginPayload {
    @IsString()
    @IsNotEmpty()
    type: string;
}
