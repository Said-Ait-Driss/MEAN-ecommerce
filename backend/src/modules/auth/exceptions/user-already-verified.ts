import { HttpException } from '@nestjs/common';
import { USER_ALREADY_VERIFIED } from '../constants/errors.constant';

export class UserAlreadyVerifiedException extends HttpException {
    constructor() {
        super(USER_ALREADY_VERIFIED, 400);
    }
}
