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
const employeeManagement_entity_1 = require("../../employeeManagement/entity/employeeManagement.entity");
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
        try {
            const findEmployee = await this.employeeRepository.findOne({
                where: {
                    id: requestDto.employee_id,
                },
            });
            if (!findEmployee) {
                throw this.errorMessageService.GeneralErrorCore('Employee not found.', 200);
            }
            const existingSalary = await this.employeeSalaryRepository.findOne({
                where: {
                    employee_id: requestDto.employee_id,
                },
            });
            if (existingSalary) {
                throw this.errorMessageService.GeneralErrorCore('Salary record already exists for this employee.', 200);
            }
            let fields = {
                employee_id: requestDto.employee_id,
                monthly_salary: requestDto.monthly_salary,
                working_days: requestDto.working_days,
                working_hour: requestDto.working_hour,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const employeeSalary = await this.employeeSalaryRepository.create(fields);
            if (employeeSalary) {
                return new employeeSalary_dto_1.EmployeeSalaryDto(employeeSalary);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to save employee salary data.', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async update(employee_id, requestDto) {
        try {
            const existingSalary = await this.employeeSalaryRepository.findOne({
                where: {
                    employee_id: employee_id,
                },
            });
            if (!existingSalary) {
                throw this.errorMessageService.GeneralErrorCore('Employee salary not found', 404);
            }
            if (requestDto.employee_id && requestDto.employee_id !== employee_id) {
                const newEmployee = await this.employeeRepository.findOne({
                    where: {
                        id: requestDto.employee_id,
                    },
                });
                if (!newEmployee) {
                    throw this.errorMessageService.GeneralErrorCore('New employee not found', 200);
                }
                const duplicateSalary = await this.employeeSalaryRepository.findOne({
                    where: {
                        employee_id: requestDto.employee_id,
                    },
                });
                if (duplicateSalary) {
                    throw this.errorMessageService.GeneralErrorCore('Salary record already exists for the new employee', 200);
                }
            }
            let updateFields = {
                ...requestDto,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            await this.employeeSalaryRepository.update(updateFields, {
                where: { employee_id: employee_id },
            });
            const updatedEmployeeId = requestDto.employee_id || employee_id;
            const updatedSalary = await this.employeeSalaryRepository.findOne({
                where: { employee_id: updatedEmployeeId },
            });
            if (updatedSalary) {
                return new employeeSalary_dto_1.EmployeeSalaryDto(updatedSalary);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to retrieve updated salary record', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async get(id, type = 'employee_id') {
        let employeeSalaries;
        if (type === 'id') {
            const salary = await this.employeeSalaryRepository.findByPk(id);
            if (!salary) {
                throw this.errorMessageService.GeneralErrorCore('Employee salary not found', 404);
            }
            return [new employeeSalary_dto_1.EmployeeSalaryDto(salary)];
        }
        else {
            employeeSalaries = await this.employeeSalaryRepository.findAll({
                where: {
                    employee_id: id,
                },
            });
            if (!employeeSalaries || employeeSalaries.length === 0) {
                throw this.errorMessageService.GeneralErrorCore('Employee salary not found', 404);
            }
            return employeeSalaries.map((salary) => new employeeSalary_dto_1.EmployeeSalaryDto(salary));
        }
    }
    async deleteEmployeeSalary(id) {
        try {
            const employeeSalary = await this.employeeSalaryRepository.findByPk(id);
            if (!employeeSalary) {
                throw this.errorMessageService.GeneralErrorCore('Employee salary not found', 404);
            }
            const deleted = await this.employeeSalaryRepository.destroy({
                where: { id: id },
            });
            if (deleted) {
                return { message: 'Employee salary deleted successfully' };
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to delete employee salary', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getAllEmployeeSalaries(requestDto) {
        try {
            if (requestDto && Object.keys(requestDto).length > 0) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count, count_metadata] = await this.sequelize.query(count_query, {
                    raw: true,
                });
                const countRows = count;
                const [results, metadata] = await this.sequelize.query(query, {
                    raw: true,
                });
                const listData = await Promise.all(results.map(async (employeeSalary) => {
                    if (employeeSalary['createdAt']) {
                        employeeSalary['createdAt'] = (0, moment_1.default)(employeeSalary['createdAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (employeeSalary['updatedAt']) {
                        employeeSalary['updatedAt'] = (0, moment_1.default)(employeeSalary['updatedAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    return employeeSalary;
                }));
                return {
                    recordsTotal: Number(countRows.length > 0 && countRows[0]['count'] != ''
                        ? countRows[0]['count']
                        : 0),
                    recordsFiltered: listData.length,
                    data: listData,
                };
            }
            else {
                const employeeSalaries = await this.employeeSalaryRepository.findAll({
                    include: [
                        {
                            model: employeeManagement_entity_1.Employee,
                            attributes: ['id', 'name', 'email_address'],
                        },
                    ],
                });
                if (!employeeSalaries || employeeSalaries.length === 0) {
                    throw this.errorMessageService.GeneralErrorCore('No employee salaries found', 404);
                }
                return employeeSalaries.map((salary) => new employeeSalary_dto_1.EmployeeSalaryDto(salary));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async queryBuilder(requestDto) {
        try {
            const columns = [
                'id',
                'employee_id',
                'monthly_salary',
                'working_days',
                'working_hour',
            ];
            let where = '';
            if (requestDto.employee_id && requestDto.employee_id != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` employee_id='${requestDto.employee_id}' `;
            }
            if (requestDto.search && requestDto.search.value) {
                const search = requestDto.search.value;
                if (search != '') {
                    for (const column of requestDto.columns) {
                        if (column.searchable != null && column.searchable == 'true') {
                            if (where != '') {
                                where += ` AND `;
                            }
                            where += ` ${columns[column.data]} ILIKE '%${search}%' `;
                        }
                    }
                }
            }
            if (requestDto.id != null && requestDto.id != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where = " employee_id='" + requestDto.id + "' ";
            }
            let query = `SELECT * FROM employee_salary_management`;
            let countQuery = `SELECT COUNT(*) FROM employee_salary_management`;
            if (where != '') {
                query += ` WHERE ${where}`;
                countQuery += ` WHERE ${where}`;
            }
            let orderBy = '';
            if (requestDto.order && requestDto.order.length > 0) {
                for (const order of requestDto.order) {
                    if (orderBy != '') {
                        orderBy += ',';
                    }
                    orderBy += `${order.column} ${order.dir}`;
                }
                const order = requestDto.order[0];
                orderBy = `${columns[order.column]} ${order.dir}`;
            }
            if (orderBy == '') {
                orderBy = 'created_at DESC';
            }
            query += ` ORDER BY ${orderBy}`;
            if (requestDto.length && requestDto.start) {
                if (requestDto.length != -1) {
                    query += ` LIMIT ${requestDto.length} OFFSET ${requestDto.start}`;
                }
            }
            else {
                query += ` LIMIT 10 OFFSET 0`;
            }
            return { query: query, count_query: countQuery };
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