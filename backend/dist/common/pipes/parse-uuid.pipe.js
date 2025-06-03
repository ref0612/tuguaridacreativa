"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUUIDPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const error_messages_constants_1 = require("../constants/error-messages.constants");
let ParseUUIDPipe = class ParseUUIDPipe {
    constructor(version = '4') {
        this.version = version;
    }
    transform(value) {
        if (!(0, class_validator_1.isUUID)(value, this.version)) {
            throw new common_1.BadRequestException(error_messages_constants_1.ERROR_MESSAGES.VALIDATION_ERROR, `El valor proporcionado (${value}) no es un UUID válido`);
        }
        return value;
    }
};
exports.ParseUUIDPipe = ParseUUIDPipe;
exports.ParseUUIDPipe = ParseUUIDPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], ParseUUIDPipe);
//# sourceMappingURL=parse-uuid.pipe.js.map