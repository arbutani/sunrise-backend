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
exports.EmployeeSalaryController = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const employeeSalary_services_1 = require("../service/employeeSalary.services");
const employeeSalaryRequest_dto_1 = require("../dto/employeeSalaryRequest.dto");
let EmployeeSalaryController = class EmployeeSalaryController {
    employeeSalaryService;
    errorMessageService;
    constructor(employeeSalaryService, errorMessageService) {
        this.employeeSalaryService = employeeSalaryService;
        this.errorMessageService = errorMessageService;
    }
    async createEmployee(requestDto) {
        try {
            const EmployeeSalary = await this.employeeSalaryService.create(requestDto);
            return this.errorMessageService.success(EmployeeSalary, true, 'Salary collected successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async updateEmployee(id, requestDto) {
        try {
            const updatedSalary = await this.employeeSalaryService.update(id, requestDto);
            return this.errorMessageService.success(updatedSalary, true, 'Employee Salary updated successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getEmployee(id) {
        try {
            const EmployeeSalary = await this.employeeSalaryService.get(id);
            return this.errorMessageService.success(EmployeeSalary, true, 'Employee Salary retrieved successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async deleteEmployee(id) {
        try {
            const EmployeeSalary = await this.employeeSalaryService.deleteEmployee(id);
            return this.errorMessageService.success(EmployeeSalary, true, 'Employee Salary deleted successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getAllEmployees() {
        try {
            return await this.employeeSalaryService.getAllEmployees();
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
};
exports.EmployeeSalaryController = EmployeeSalaryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employeeSalaryRequest_dto_1.EmployeeSalaryRequestDto]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "getAllEmployees", null);
exports.EmployeeSalaryController = EmployeeSalaryController = __decorate([
    (0, common_1.Controller)('employee-salary'),
    __metadata("design:paramtypes", [employeeSalary_services_1.EmployeeSalaryService,
        errormessage_service_1.ErrorMessageService])
], EmployeeSalaryController);
//# sourceMappingURL=employeeSalary.controller.js.map