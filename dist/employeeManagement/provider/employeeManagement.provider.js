"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProvider = void 0;
const employeeSalary_entity_1 = require("../../employeeSalaryManagement/entity/employeeSalary.entity");
const employeeManagement_entity_1 = require("../entity/employeeManagement.entity");
exports.employeeProvider = [
    {
        provide: 'EMPLOYEE_REPOSITORY',
        useValue: employeeManagement_entity_1.Employee,
    },
    {
        provide: 'EMPLOYEE_SALARY_REPOSITORY',
        useValue: employeeSalary_entity_1.EmployeeSalary,
    },
];
//# sourceMappingURL=employeeManagement.provider.js.map