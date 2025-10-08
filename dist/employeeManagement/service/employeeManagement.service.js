"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const employeeManagement_dto_1 = require("../dto/employeeManagement.dto");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let EmployeeService = class EmployeeService {
    employeeSalaryRepository;
    employeeRepository;
    sequelize;
    errorMessageService;
    jwtService;
    constructor(employeeSalaryRepository, employeeRepository, sequelize, errorMessageService, jwtService) {
        this.employeeSalaryRepository = employeeSalaryRepository;
        this.employeeRepository = employeeRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
        this.jwtService = jwtService;
    }
    async createEmployee(requestDto) {
        try {
            const existingEmployee = await this.employeeRepository.findOne({
                where: { email_address: requestDto.email_address },
            });
            if (existingEmployee) {
                throw this.errorMessageService.GeneralErrorCore('Employee with this email address already exists', 200);
            }
            const lastEmployee = await this.employeeRepository.findOne({
                order: [['createdAt', 'DESC']],
            });
            let nextSeriesNumber = 1;
            if (lastEmployee && lastEmployee.reference_number) {
                const match = lastEmployee.reference_number.match(/\d+/);
                if (match) {
                    const lastSeriesNumber = parseInt(match[0], 10);
                    if (!isNaN(lastSeriesNumber)) {
                        nextSeriesNumber = lastSeriesNumber + 1;
                    }
                }
            }
            const dateString = (0, moment_1.default)().format('DDMMYY');
            const newReferenceNumber = `E${nextSeriesNumber}-${dateString}`;
            const hashedPassword = await bcrypt.hash(requestDto.password, 10);
            const employeeFields = {
                reference_number: newReferenceNumber,
                reference_date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                name: requestDto.name,
                email_address: requestDto.email_address,
                password: hashedPassword,
                type: requestDto.type,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                deletedAt: null,
            };
            const employee = await this.employeeRepository.create(employeeFields);
            const newEmployee = await this.employeeRepository.findByPk(employee.id);
            return new employeeManagement_dto_1.EmployeeDto(newEmployee);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async login(email, password) {
        try {
            const employee = await this.employeeRepository.findOne({
                where: { email_address: email },
            });
            if (!employee) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, employee.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = {
                sub: employee.id,
                email: employee.email_address,
                type: employee.type,
                username: employee.name,
            };
            const token = await this.jwtService.signAsync(payload, {
                secret: 'MY_SECRET_KEY',
                expiresIn: '1h',
            });
            return {
                access_token: token,
                employee: new employeeManagement_dto_1.EmployeeDto(employee),
                type: employee.type,
            };
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async updateEmployee(id, requestDto) {
        try {
            const oldEmployee = await this.employeeRepository.findByPk(id);
            if (!oldEmployee) {
                throw this.errorMessageService.GeneralErrorCore('Employee not found', 404);
            }
            if (requestDto.email_address !== oldEmployee.email_address) {
                const findEmployee = await this.employeeRepository.findOne({
                    where: {
                        email_address: requestDto.email_address,
                        id: { [sequelize_1.Op.ne]: id },
                    },
                });
                if (findEmployee) {
                    throw this.errorMessageService.GeneralErrorCore('Employee with this email address already exists', 200);
                }
            }
            const hashedPassword = requestDto.password
                ? await bcrypt.hash(requestDto.password, 10)
                : oldEmployee.password;
            const employeeFields = {
                name: requestDto.name,
                email_address: requestDto.email_address,
                type: requestDto.type,
                password: hashedPassword,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const [updatedCount] = await this.employeeRepository.update(employeeFields, { where: { id } });
            if (updatedCount > 0) {
                const updatedEmployee = await this.employeeRepository.findByPk(id);
                return new employeeManagement_dto_1.EmployeeDto(updatedEmployee);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to update employee', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getEmployee(id) {
        try {
            const employee = await this.employeeRepository.findByPk(id);
            if (!employee) {
                throw this.errorMessageService.GeneralErrorCore('Employee not found', 404);
            }
            return new employeeManagement_dto_1.EmployeeDto(employee);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async queryBuilder(requestDto) {
        try {
            const columns = [
                'id',
                'reference_number',
                'name',
                'email_address',
                'type',
                'createdAt',
            ];
            let where = 'deleted_at IS NULL';
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
            if (requestDto.type && requestDto.type != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` type='${requestDto.type}' `;
            }
            if (requestDto.name && requestDto.name != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` name ILIKE '%${requestDto.name}%' `;
            }
            let query = `SELECT * FROM employees`;
            let countQuery = `SELECT COUNT(*) FROM employees`;
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
    async getAllEmployees(requestDto) {
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
                const listData = await Promise.all(results.map(async (employee) => {
                    if (employee['createdAt']) {
                        employee['createdAt'] = (0, moment_1.default)(employee['createdAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (employee['updatedAt']) {
                        employee['updatedAt'] = (0, moment_1.default)(employee['updatedAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (employee['reference_date']) {
                        employee['reference_date'] = (0, moment_1.default)(employee['reference_date']).format('DD-MM-YYYY');
                    }
                    return employee;
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
                const employees = await this.employeeRepository.findAll({
                    where: (0, sequelize_1.literal)('deleted_at IS NULL'),
                });
                if (!employees || employees.length === 0) {
                    throw this.errorMessageService.GeneralErrorCore('No employees found', 404);
                }
                return employees.map((employee) => new employeeManagement_dto_1.EmployeeDto(employee));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteEmployee(id) {
        try {
            const [updatedRows] = await this.employeeRepository.update({ deletedAt: new Date() }, {
                where: (0, sequelize_1.literal)(`id='${id}' AND deleted_at IS NULL`),
            });
            if (updatedRows === 0) {
                throw this.errorMessageService.GeneralErrorCore('Employee not found', 404);
            }
            return { message: 'Employee deleted successfully' };
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('EMPLOYEE_SALARY_REPOSITORY')),
    __param(1, (0, common_1.Inject)('EMPLOYEE_REPOSITORY')),
    __param(2, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, Object, sequelize_1.Sequelize,
        errormessage_service_1.ErrorMessageService,
        jwt_1.JwtService])
], EmployeeService);
//# sourceMappingURL=employeeManagement.service.js.map