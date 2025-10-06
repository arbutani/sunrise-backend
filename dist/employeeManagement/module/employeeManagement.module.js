"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeModule = void 0;
const common_1 = require("@nestjs/common");
const employeeManagement_controller_1 = require("../controller/employeeManagement.controller");
const employeeManagement_provider_1 = require("../provider/employeeManagement.provider");
const employeeManagement_service_1 = require("../service/employeeManagement.service");
const jwt_1 = require("@nestjs/jwt");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const jwt_auth_guard_1 = require("../../JwtAuthGuard/jwt_auth.guard");
const employeeSalary_services_1 = require("../../employeeSalaryManagement/service/employeeSalary.services");
const employeeSalary_controller_1 = require("../../employeeSalaryManagement/controller/employeeSalary.controller");
let EmployeeModule = class EmployeeModule {
};
exports.EmployeeModule = EmployeeModule;
exports.EmployeeModule = EmployeeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: 'MY_SECRET_KEY',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [employeeManagement_controller_1.EmployeeController, employeeSalary_controller_1.EmployeeSalaryController],
        providers: [
            ...employeeManagement_provider_1.employeeProvider,
            employeeManagement_service_1.EmployeeService,
            errormessage_service_1.ErrorMessageService,
            jwt_auth_guard_1.JwtAuthGuard,
            employeeSalary_services_1.EmployeeSalaryService,
        ],
        exports: [employeeManagement_service_1.EmployeeService],
    })
], EmployeeModule);
//# sourceMappingURL=employeeManagement.module.js.map