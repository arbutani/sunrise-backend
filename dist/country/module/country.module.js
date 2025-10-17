"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../../JwtAuthGuard/jwt_auth.guard");
const country_controller_1 = require("../controller/country.controller");
const country_service_1 = require("../service/country.service");
const country_provider_1 = require("../provider/country.provider");
let CountryModule = class CountryModule {
};
exports.CountryModule = CountryModule;
exports.CountryModule = CountryModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [country_controller_1.CountryController],
        providers: [
            country_service_1.CountryService,
            jwt_auth_guard_1.JwtAuthGuard,
            {
                provide: jwt_1.JwtService,
                useValue: new jwt_1.JwtService({}),
            },
            ...country_provider_1.CountryProvider,
        ],
        exports: [
            ...country_provider_1.CountryProvider,
            country_service_1.CountryService,
        ],
    })
], CountryModule);
//# sourceMappingURL=country.module.js.map