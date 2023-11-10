import type { ErrorCodeEnum } from '@/enums/ErrorCodeEnum';

export interface ApiResponseInterface {
    message?: string;
    error_code?: ErrorCodeEnum;
}
