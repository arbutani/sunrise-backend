"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSalaryDto = void 0;
const moment_1 = __importDefault(require("moment"));
class EmployeeSalaryDto {
    id;
    employee_id;
    monthly_salary;
    working_days;
    working_hour;
    over_time;
    leave_day;
    total_attempts_day;
    total_payable_salary;
    reference_number;
    reference_number_date;
    createdAt;
    updatedAt;
    constructor(data) {
        if (data) {
            data = data.dataValues ? data.dataValues : data;
            this.id = data.id;
            this.employee_id = data.employee_id;
            this.monthly_salary = data.monthly_salary;
            this.working_days = data.working_days;
            this.working_hour = data.working_hour;
            this.over_time = data.over_time;
            this.leave_day = data.leave_day;
            this.total_attempts_day = data.total_attempts_day;
            this.total_payable_salary = data.total_payable_salary;
            this.reference_number = data.reference_number;
            this.reference_number_date = data.reference_number_date;
            const createdAt = data.createdAt
                ? data.createdAt
                : data.created_at
                    ? data.created_at
                    : '';
            const updatedAt = data.updatedAt
                ? data.updatedAt
                : data.updated_at
                    ? data.updated_at
                    : '';
            if (createdAt) {
                this.createdAt = (0, moment_1.default)(createdAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
            }
            if (updatedAt) {
                this.updatedAt = (0, moment_1.default)(updatedAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
            }
        }
    }
}
exports.EmployeeSalaryDto = EmployeeSalaryDto;
//# sourceMappingURL=employeeSalary.dto.js.map