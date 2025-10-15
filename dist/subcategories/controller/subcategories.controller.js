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
exports.SubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const subcategories_services_1 = require("../service/subcategories.services");
const subcategoriesRequest_dto_1 = require("../dto/subcategoriesRequest.dto");
let SubcategoriesController = class SubcategoriesController {
    subcategoriesService;
    errorMessageService;
    constructor(subcategoriesService, errorMessageService) {
        this.subcategoriesService = subcategoriesService;
        this.errorMessageService = errorMessageService;
    }
    async createSubcategory(requestDto) {
        try {
            const subcategory = await this.subcategoriesService.create(requestDto);
            return this.errorMessageService.success(subcategory, true, 'Subcategory created successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async updateSubcategory(id, requestDto) {
        try {
            const subcategory = await this.subcategoriesService.update(id, requestDto);
            return this.errorMessageService.success(subcategory, true, 'Subcategory updated successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getSubcategoriesByCategory(category_id) {
        try {
            const subcategories = await this.subcategoriesService.get(category_id);
            return this.errorMessageService.success(subcategories, true, 'Subcategories retrieved successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getAllSubcategories(query) {
        try {
            return await this.subcategoriesService.getAllSubcategories(query);
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async deleteSubcategory(id) {
        try {
            const result = await this.subcategoriesService.deleteSubcategory(id);
            return this.errorMessageService.success(result, true, 'Subcategory deleted successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
};
exports.SubcategoriesController = SubcategoriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subcategoriesRequest_dto_1.SubcategoriesRequestDto]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "createSubcategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "updateSubcategory", null);
__decorate([
    (0, common_1.Get)('category/:category_id'),
    __param(0, (0, common_1.Param)('category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "getSubcategoriesByCategory", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "getAllSubcategories", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "deleteSubcategory", null);
exports.SubcategoriesController = SubcategoriesController = __decorate([
    (0, common_1.Controller)('subcategories'),
    __metadata("design:paramtypes", [subcategories_services_1.SubcategoriesService,
        errormessage_service_1.ErrorMessageService])
], SubcategoriesController);
//# sourceMappingURL=subcategories.controller.js.map