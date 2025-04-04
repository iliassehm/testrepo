"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const Sentry = require("@sentry/node");
let SentryFilter = class SentryFilter extends core_1.BaseExceptionFilter {
    catch(exception, host) {
        Sentry.withScope(scope => {
            const request = host.switchToHttp().getRequest();
            scope.setExtra('url', request.url);
            scope.setExtra('method', request.method);
            scope.setExtra('headers', request.headers);
            scope.setExtra('body', request.body);
            Sentry.captureException(exception);
        });
        super.catch(exception, host);
    }
};
exports.SentryFilter = SentryFilter;
exports.SentryFilter = SentryFilter = __decorate([
    (0, common_1.Catch)()
], SentryFilter);
//# sourceMappingURL=SentryFilter.js.map