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
exports.EmployeeSalaryRequestDto = void 0;
const class_validator_1 = require("class-validator");
class EmployeeSalaryRequestDto {
    employee_id;
    monthly_salary;
    working_days;
    working_hour;
    over_time;
    leave_day;
    reference_number;
    reference_number_date;
}
exports.EmployeeSalaryRequestDto = EmployeeSalaryRequestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Employee ID must be a valid UUID' }),
    __metadata("design:type", String)
], EmployeeSalaryRequestDto.prototype, "employee_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Monthly salary is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Monthly salary must be a number' }),
    __metadata("design:type", Number)
], EmployeeSalaryRequestDto.prototype, "monthly_salary", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Working days must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmployeeSalaryRequestDto.prototype, "working_days", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Working hour must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmployeeSalaryRequestDto.prototype, "working_hour", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Overtime must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmployeeSalaryRequestDto.prototype, "over_time", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Leave day must be a number' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], EmployeeSalaryRequestDto.prototype, "leave_day", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reference number must be a string' }),
    __metadata("design:type", String)
], EmployeeSalaryRequestDto.prototype, "reference_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Reference number date must be a string' }),
    __metadata("design:type", String)
], EmployeeSalaryRequestDto.prototype, "reference_number_date", void 0);
//# sourceMappingURL=employeeSalaryRequest.dto.js.map