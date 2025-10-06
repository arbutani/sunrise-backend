"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeDto = void 0;
const moment_1 = __importDefault(require("moment"));
class EmployeeDto {
    id;
    employee_name;
    email_address;
    employee_type;
    reference_number;
    reference_number_date;
    createdAt;
    updatedAt;
    constructor(data) {
        data = data.dataValues ? data.dataValues : data;
        this.id = data.id;
        this.reference_number = data.reference_number;
        this.reference_number_date = data.reference_number_date;
        this.employee_name = data.employee_name;
        this.email_address = data.email_address;
        this.employee_type = data.type;
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
exports.EmployeeDto = EmployeeDto;
//# sourceMappingURL=employeeManagement.dto.js.map