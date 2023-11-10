import type { ErrorCodeEnum } from '@/enums/ErrorCodeEnum';
import type { StatusCodeEnum } from '@/enums/StatusCodeEnum';

export class RequestError extends Error {
    public errorCode: ErrorCodeEnum;
    public override message: string;
    public statusCode: StatusCodeEnum;

    public constructor(errorCode: ErrorCodeEnum, message: string, statusCode: StatusCodeEnum) {
        super();
        Object.setPrototypeOf(this, RequestError.prototype);
        this.errorCode = errorCode;
        this.message = message;
        this.statusCode = statusCode;
    }
}
