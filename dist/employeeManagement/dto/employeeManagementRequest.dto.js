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
exports.EmployeeRequestDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const employeeSalaryRequest_dto_1 = require("../../employeeSalaryManagement/dto/employeeSalaryRequest.dto");
const employeeType_enum_1 = require("../../shared/enum/employeeManagement/employeeType.enum");
class EmployeeRequestDto {
    name;
    email_address;
    password;
    type;
    salary;
}
exports.EmployeeRequestDto = EmployeeRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Employee name is required' }),
    (0, class_validator_1.IsString)({ message: 'Employee name must be a string' }),
    __metadata("design:type", String)
], EmployeeRequestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email address is required' }),
    (0, class_validator_1.IsString)({ message: 'Email address must be a string' }),
    __metadata("design:type", String)
], EmployeeRequestDto.prototype, "email_address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    __metadata("design:type", String)
], EmployeeRequestDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Employee type is required' }),
    (0, class_validator_1.IsEnum)(employeeType_enum_1.EmployeeType, {
        message: 'Employee type must be one of the allowed values',
    }),
    __metadata("design:type", String)
], EmployeeRequestDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => employeeSalaryRequest_dto_1.EmployeeSalaryRequestDto),
    __metadata("design:type", employeeSalaryRequest_dto_1.EmployeeSalaryRequestDto)
], EmployeeRequestDto.prototype, "salary", void 0);
//# sourceMappingURL=employeeManagementRequest.dto.js.map