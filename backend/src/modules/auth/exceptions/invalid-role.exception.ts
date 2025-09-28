import { HttpException } from '@nestjs/common';
import { INVALID_ROLE } from '../constants/errors.constant';

export class InvalidRoleException extends HttpException {
    constructor() {
        super(INVALID_ROLE, 400);
    }
}
