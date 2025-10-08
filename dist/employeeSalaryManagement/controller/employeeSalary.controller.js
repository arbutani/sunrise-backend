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
    async createEmployeeSalary(requestDto) {
        try {
            const employeeSalary = await this.employeeSalaryService.create(requestDto);
            return this.errorMessageService.success(employeeSalary, true, 'Salary created successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async updateEmployeeSalary(employee_id, requestDto) {
        try {
            const updatedSalary = await this.employeeSalaryService.update(employee_id, requestDto);
            return this.errorMessageService.success(updatedSalary, true, 'Employee Salary updated successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getEmployeeSalary(employee_id) {
        try {
            const employeeSalary = await this.employeeSalaryService.get(employee_id);
            return this.errorMessageService.success(employeeSalary, true, 'Employee Salary retrieved successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async deleteEmployeeSalary(id) {
        try {
            const result = await this.employeeSalaryService.deleteEmployeeSalary(id);
            return this.errorMessageService.success(result, true, 'Employee Salary deleted successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getAllEmployeeSalaries() {
        try {
            const employeeSalaries = await this.employeeSalaryService.getAllEmployeeSalaries();
            return this.errorMessageService.success(employeeSalaries, true, 'Employee salaries retrieved successfully', {});
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
], EmployeeSalaryController.prototype, "createEmployeeSalary", null);
__decorate([
    (0, common_1.Put)(':employee_id'),
    __param(0, (0, common_1.Param)('employee_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "updateEmployeeSalary", null);
__decorate([
    (0, common_1.Get)('employee/:employee_id'),
    __param(0, (0, common_1.Param)('employee_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "getEmployeeSalary", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "deleteEmployeeSalary", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeSalaryController.prototype, "getAllEmployeeSalaries", null);
exports.EmployeeSalaryController = EmployeeSalaryController = __decorate([
    (0, common_1.Controller)('employee-salary'),
    __metadata("design:paramtypes", [employeeSalary_services_1.EmployeeSalaryService,
        errormessage_service_1.ErrorMessageService])
], EmployeeSalaryController);
//# sourceMappingURL=employeeSalary.controller.js.map