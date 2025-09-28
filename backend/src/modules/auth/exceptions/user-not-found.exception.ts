import { HttpException } from '@nestjs/common';
import { USER_NOT_FOUND } from '../constants/errors.constant';

export class UserNotFoundException extends HttpException {
    constructor() {
        super(USER_NOT_FOUND, 400);
    }
}
