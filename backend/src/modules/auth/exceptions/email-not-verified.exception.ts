import { HttpException } from '@nestjs/common';
import { EMAIL_NOT_VERIFIED } from '../constants/errors.constant';

export class EmailNotVerifiedException extends HttpException {
    constructor() {
        super(EMAIL_NOT_VERIFIED, 400);
    }
}
