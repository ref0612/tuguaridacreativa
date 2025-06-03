"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const error_messages_constants_1 = require("../constants/error-messages.constants");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = error_messages_constants_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let validationErrors = [];
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const response = exception.getResponse();
            if (typeof response === 'object' && response !== null) {
                message = response.message || message;
                error = response.error || error;
                if (Array.isArray(response.message)) {
                    validationErrors = response.message;
                }
            }
            else if (typeof response === 'string') {
                message = response;
            }
        }
        else if (exception instanceof typeorm_1.QueryFailedError) {
            status = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
            message = error_messages_constants_1.ERROR_MESSAGES.DATABASE_ERROR;
            error = exception.message;
            if (exception.message.includes('duplicate key')) {
                message = 'El registro ya existe';
                error = 'Duplicate Key Error';
            }
        }
        else if (exception instanceof typeorm_1.EntityNotFoundError) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = error_messages_constants_1.ERROR_MESSAGES.RESOURCE_NOT_FOUND;
            error = 'Not Found';
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = exception.name;
        }
        this.logError(exception, request);
        response.status(status).json({
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(validationErrors.length > 0 && { errors: validationErrors }),
        });
    }
    logError(exception, request) {
        const { method, url, body, user } = request;
        const userInfo = user ? `[User: ${JSON.stringify(user)}]` : '[Unauthenticated]';
        this.logger.error(`${method} ${url} ${userInfo}\n` +
            `Body: ${JSON.stringify(body)}\n` +
            `Error: ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}`);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map