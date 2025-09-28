import { HttpException } from '@nestjs/common';
import { CANNOT_AUTHENTICATE } from '../constants/errors.constant';

export class AuthErrorException extends HttpException {
    constructor() {
        super(CANNOT_AUTHENTICATE, 400);
    }
}
