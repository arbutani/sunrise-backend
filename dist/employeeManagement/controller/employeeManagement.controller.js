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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const employeeManagementRequest_dto_1 = require("../dto/employeeManagementRequest.dto");
const employeeManagement_service_1 = require("../service/employeeManagement.service");
const public_decorator_1 = require("../../JwtAuthGuard/public.decorator");
const employeeManagementPutRequest_dto_1 = require("../dto/employeeManagementPutRequest.dto");
let EmployeeController = class EmployeeController {
    employeeService;
    errorMessageService;
    constructor(employeeService, errorMessageService) {
        this.employeeService = employeeService;
        this.errorMessageService = errorMessageService;
    }
    async createEmployee(requestDto) {
        try {
            const employee_management = await this.employeeService.createEmployee(requestDto);
            return this.errorMessageService.success(employee_management, true, 'Employee created successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async login(body) {
        try {
            const result = await this.employeeService.login(body.email, body.password);
            return this.errorMessageService.success(result, true, 'Login successful', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async updateEmployee(id, requestDto) {
        try {
            const employee_management = await this.employeeService.updateEmployee(id, requestDto);
            return this.errorMessageService.success(employee_management, true, 'Employee updated successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getEmployee(id) {
        try {
            const employee_management = await this.employeeService.getEmployee(id);
            return this.errorMessageService.success(employee_management, true, 'Employee retrieved successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async getAllEmployees(query) {
        try {
            return await this.employeeService.getAllEmployees(query);
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
    async deleteEmployee(id) {
        try {
            const employee_management = await this.employeeService.deleteEmployee(id);
            return this.errorMessageService.success(employee_management, true, 'Employee deleted successfully', {});
        }
        catch (error) {
            throw this.errorMessageService.error(error);
        }
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employeeManagementRequest_dto_1.EmployeeRequestDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "createEmployee", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "login", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employeeManagementPutRequest_dto_1.EmployeePutRequestDto]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "getAllEmployees", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeController.prototype, "deleteEmployee", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, common_1.Controller)('employee-management'),
    __metadata("design:paramtypes", [employeeManagement_service_1.EmployeeService,
        errormessage_service_1.ErrorMessageService])
], EmployeeController);
//# sourceMappingURL=employeeManagement.controller.js.map