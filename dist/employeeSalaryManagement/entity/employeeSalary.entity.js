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
exports.EmployeeSalary = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const employeeManagement_entity_1 = require("../../employeeManagement/entity/employeeManagement.entity");
let EmployeeSalary = class EmployeeSalary extends sequelize_typescript_1.Model {
    employee_id;
    monthly_salary;
    working_days;
    working_hour;
};
exports.EmployeeSalary = EmployeeSalary;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        primaryKey: true,
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmployeeSalary.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => employeeManagement_entity_1.Employee),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], EmployeeSalary.prototype, "employee_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => employeeManagement_entity_1.Employee),
    __metadata("design:type", employeeManagement_entity_1.Employee)
], EmployeeSalary.prototype, "employee", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.NUMBER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], EmployeeSalary.prototype, "monthly_salary", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], EmployeeSalary.prototype, "working_days", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: true,
    }),
    __metadata("design:type", Number)
], EmployeeSalary.prototype, "working_hour", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        field: 'created_at',
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], EmployeeSalary.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        field: 'updated_at',
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
    }),
    __metadata("design:type", Date)
], EmployeeSalary.prototype, "updatedAt", void 0);
exports.EmployeeSalary = EmployeeSalary = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'employee_salary_management',
        timestamps: false,
    })
], EmployeeSalary);
//# sourceMappingURL=employeeSalary.entity.js.map