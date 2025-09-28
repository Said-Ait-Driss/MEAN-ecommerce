import { HttpException } from '@nestjs/common';
import { CLEANER_ALREADY_EXISTS } from '../constants/errors.constant';

export class CleanerAlreadyExistsException extends HttpException {
    constructor() {
        super(CLEANER_ALREADY_EXISTS, 400);
    }
}
