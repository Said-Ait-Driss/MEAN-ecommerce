import { HttpException } from '@nestjs/common';
import { INVALID_CREDENTIALS } from '../constants/errors.constant';

export class InvalidCredentialsException extends HttpException {
    constructor() {
        super(INVALID_CREDENTIALS, 400);
    }
}
