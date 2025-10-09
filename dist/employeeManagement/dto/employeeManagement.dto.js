"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDto = void 0;
const moment_1 = __importDefault(require("moment"));
class EmployeeDto {
    id;
    name;
    email_address;
    type;
    reference_number;
    reference_date;
    createdAt;
    updatedAt;
    deletedAt;
    salary;
    constructor(data) {
        data = data.dataValues ? data.dataValues : data;
        this.id = data.id;
        this.reference_number = data.reference_number;
        this.reference_date = data.reference_date;
        this.name = data.name;
        this.email_address = data.email_address;
        this.type = data.type;
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
        const deletedAt = data.deletedAt
            ? data.deletedAt
            : data.deleted_at
                ? data.deleted_at
                : '';
        if (createdAt) {
            this.createdAt = (0, moment_1.default)(createdAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
        }
        if (updatedAt) {
            this.updatedAt = (0, moment_1.default)(updatedAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
        }
        if (deletedAt) {
            this.deletedAt = (0, moment_1.default)(deletedAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
        }
        if (data.salaries && data.salaries.length > 0) {
            const salary = data.salaries[0];
            this.salary = {
                monthly_salary: salary.monthly_salary,
                working_days: salary.working_days,
                working_hour: salary.working_hour,
            };
        }
    }
}
exports.EmployeeDto = EmployeeDto;
//# sourceMappingURL=employeeManagement.dto.js.map