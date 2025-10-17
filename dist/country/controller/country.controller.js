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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const jwt_auth_guard_1 = require("../../JwtAuthGuard/jwt_auth.guard");
const country_service_1 = require("../service/country.service");
const countryRequest_dto_1 = require("../dto/countryRequest.dto");
let CountryController = class CountryController {
    countryService;
    errorMessageService;
    constructor(countryService, errorMessageService) {
        this.countryService = countryService;
        this.errorMessageService = errorMessageService;
    }
    async createCountry(requestDto) {
        try {
            const country = await this.countryService.createCountry(requestDto);
            return this.errorMessageService.success(country, true, 'Country created successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async updateCountry(id, requestDto) {
        try {
            const country = await this.countryService.updateCountry(id, requestDto);
            return this.errorMessageService.success(country, true, 'Country updated successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getCountry(id) {
        try {
            const country = await this.countryService.getCountry(id);
            return this.errorMessageService.success(country, true, 'Country retrieved successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getAllCountries(query) {
        try {
            return await this.countryService.getAllCountries(query);
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async deleteCountry(id) {
        try {
            const result = await this.countryService.deleteCountry(id);
            return this.errorMessageService.success(result, true, 'Country deleted successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
};
exports.CountryController = CountryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [countryRequest_dto_1.CountryRequestDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "createCountry", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, countryRequest_dto_1.CountryRequestDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "updateCountry", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "getCountry", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "getAllCountries", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "deleteCountry", null);
exports.CountryController = CountryController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('country'),
    __metadata("design:paramtypes", [country_service_1.CountryService,
        errormessage_service_1.ErrorMessageService])
], CountryController);
//# sourceMappingURL=country.controller.js.map