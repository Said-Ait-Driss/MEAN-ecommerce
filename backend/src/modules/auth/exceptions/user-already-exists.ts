import { HttpException } from '@nestjs/common';
import { USER_ALREADY_EXISTS } from '../constants/errors.constant';

export class UserAlreadyExistsException extends HttpException {
    constructor() {
        super(USER_ALREADY_EXISTS, 400);
    }
}
