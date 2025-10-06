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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeSalaryService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_typescript_1 = require("sequelize-typescript");
const employeeSalary_dto_1 = require("../dto/employeeSalary.dto");
let EmployeeSalaryService = class EmployeeSalaryService {
    employeeSalaryRepository;
    employeeRepository;
    sequelize;
    errorMessageService;
    constructor(employeeSalaryRepository, employeeRepository, sequelize, errorMessageService) {
        this.employeeSalaryRepository = employeeSalaryRepository;
        this.employeeRepository = employeeRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
    }
    async create(requestDto) {
        const transaction = await this.sequelize.transaction();
        try {
            const lastEmployeeSalary = await this.employeeSalaryRepository.findOne({
                order: [['createdAt', 'DESC']],
                transaction,
            });
            let nextSeriesNumber = 1;
            if (lastEmployeeSalary && lastEmployeeSalary.reference_number) {
                const match = lastEmployeeSalary.reference_number.match(/\d+/);
                if (match) {
                    const lastSeriesNumber = parseInt(match[0], 10);
                    if (!isNaN(lastSeriesNumber)) {
                        nextSeriesNumber = lastSeriesNumber + 1;
                    }
                }
            }
            const dateString = (0, moment_1.default)().format('DDMMYY');
            const newReferenceNumber = `ES${nextSeriesNumber}-${dateString}`;
            const fields = {
                employee_id: requestDto.employee_id,
                monthly_salary: requestDto.monthly_salary,
                working_days: requestDto.working_days,
                working_hour: requestDto.working_hour,
                over_time: requestDto.over_time,
                leave_day: requestDto.leave_day,
                reference_number: newReferenceNumber,
                reference_number_date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const employeesalary = await this.employeeSalaryRepository.create(fields, { transaction });
            await transaction.commit();
            return new employeeSalary_dto_1.EmployeeSalaryDto(employeesalary);
        }
        catch (error) {
            await transaction.rollback();
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async update(employee_id, requestDto) {
        try {
            const existingSalary = await this.employeeSalaryRepository.findOne({
                where: { employee_id },
            });
            if (!existingSalary) {
                throw this.errorMessageService.GeneralErrorCore('Employee Salary not found', 404);
            }
            const updatedFields = { ...requestDto };
            if (updatedFields.reference_number_date) {
                updatedFields.reference_number_date = new Date(updatedFields.reference_number_date);
            }
            if (updatedFields.updatedAt) {
                updatedFields.updatedAt = new Date(updatedFields.updatedAt);
            }
            await this.employeeSalaryRepository.update(updatedFields, {
                where: { employee_id },
            });
            const updatedSalary = await this.employeeSalaryRepository.findOne({
                where: { employee_id },
            });
            return new employeeSalary_dto_1.EmployeeSalaryDto(updatedSalary);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async get(employee_id) {
        try {
            const employeesalary = await this.employeeSalaryRepository.findOne({
                where: { employee_id: employee_id },
            });
            if (!employeesalary) {
                throw this.errorMessageService.GeneralErrorCore('Employee salary not found', 404);
            }
            return new employeeSalary_dto_1.EmployeeSalaryDto(employeesalary);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteEmployee(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const employeesalary = await this.employeeSalaryRepository.findByPk(id, {
                transaction,
            });
            if (!employeesalary) {
                await transaction.rollback();
                throw this.errorMessageService.GeneralErrorCore('Employee not found', 404);
            }
            const deleted = await this.employeeSalaryRepository.destroy({
                where: { id: id },
                transaction,
            });
            if (deleted) {
                await transaction.commit();
                return { message: 'Employee salary deleted successfully' };
            }
            else {
                await transaction.rollback();
                throw this.errorMessageService.GeneralErrorCore('Failed to delete Employee Salary', 200);
            }
        }
        catch (error) {
            await transaction.rollback();
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getAllEmployees() {
        try {
            const employees = await this.employeeSalaryRepository.findAll();
            if (!employees || employees.length === 0) {
                throw this.errorMessageService.GeneralErrorCore('NO Employee found', 404);
            }
            return employees.map((employee) => new employeeSalary_dto_1.EmployeeSalaryDto(employee));
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.EmployeeSalaryService = EmployeeSalaryService;
exports.EmployeeSalaryService = EmployeeSalaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('EMPLOYEE_SALARY_REPOSITORY')),
    __param(1, (0, common_1.Inject)('EMPLOYEE_REPOSITORY')),
    __param(2, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize,
        errormessage_service_1.ErrorMessageService])
], EmployeeSalaryService);
//# sourceMappingURL=employeeSalary.services.js.map