import { ExecutionContext } from '@nestjs/common';
declare const JwtRefreshGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtRefreshGuard extends JwtRefreshGuard_base {
    constructor();
    getRequest(context: ExecutionContext): any;
}
export {};
