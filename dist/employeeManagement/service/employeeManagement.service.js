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
const sequelize_typescript_1 = require("sequelize-typescript");
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
    async createemployee(requestDto) {
        try {
            const findEmployee = await this.employeeRepository.findOne({
                where: { email_address: requestDto.email_address },
            });
            if (findEmployee) {
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
                reference_number_date: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                employee_name: requestDto.employee_name,
                email_address: requestDto.email_address,
                password: hashedPassword,
                employee_type: requestDto.employee_type,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
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
                type: employee.employee_type,
                username: employee.employee_name,
            };
            const token = await this.jwtService.signAsync(payload, {
                secret: 'MY_SECRET_KEY',
                expiresIn: '1h',
            });
            return {
                access_token: token,
                employee: new employeeManagement_dto_1.EmployeeDto(employee),
                employee_type: employee.employee_type,
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
                employee_name: requestDto.employee_name,
                email_address: requestDto.email_address,
                employee_type: requestDto.employee_type,
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
    async getAllEmployees(query) {
        try {
            const parsedQuery = {
                start: query.start || '0',
                length: query.length || '10',
                draw: query.draw || '1',
                search: {},
                order: [],
                columns: [],
            };
            if (query['search[value]']) {
                parsedQuery.search.value = query['search[value]'];
                parsedQuery.search.regex = query['search[regex]'] || 'false';
            }
            let orderIndex = 0;
            while (query[`order[${orderIndex}][column]`]) {
                parsedQuery.order.push({
                    column: query[`order[${orderIndex}][column]`],
                    dir: query[`order[${orderIndex}][dir]`] || 'asc',
                });
                orderIndex++;
            }
            let columnIndex = 0;
            while (query[`columns[${columnIndex}][data]`]) {
                parsedQuery.columns.push({
                    data: query[`columns[${columnIndex}][data]`],
                    name: query[`columns[${columnIndex}][name]`] || '',
                    searchable: query[`columns[${columnIndex}][searchable]`] || 'true',
                    orderable: query[`columns[${columnIndex}][orderable]`] || 'true',
                    search: {
                        value: query[`columns[${columnIndex}][search][value]`] || '',
                        regex: query[`columns[${columnIndex}][search][regex]`] || 'false',
                    },
                });
                columnIndex++;
            }
            const { start, length, search, order, columns } = parsedQuery;
            const whereCondition = {};
            if (search && search.value) {
                whereCondition[sequelize_1.Op.or] = [
                    { employee_name: { [sequelize_1.Op.like]: `%${search.value}%` } },
                    { email_address: { [sequelize_1.Op.like]: `%${search.value}%` } },
                ];
            }
            const orderCondition = [];
            if (order &&
                order.length > 0 &&
                columns &&
                columns.length > order[0].column) {
                const orderByColumn = columns[order[0].column].data;
                const orderDirection = order[0].dir.toUpperCase();
                if (orderByColumn) {
                    orderCondition.push([orderByColumn, orderDirection]);
                }
            }
            const recordsTotal = await this.employeeRepository.count({
                distinct: true,
            });
            const result = await this.employeeRepository.findAndCountAll({
                limit: parseInt(length, 10),
                offset: parseInt(start, 10),
                where: whereCondition,
                order: orderCondition,
                distinct: true,
            });
            const employees = result.rows.map((employee) => {
                const employeeData = new employeeManagement_dto_1.EmployeeDto(employee);
                return {
                    ...employeeData,
                };
            });
            return {
                draw: parsedQuery.draw,
                data: employees,
                recordsTotal: recordsTotal,
                recordsFiltered: result.count,
            };
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteEmployee(id) {
        try {
            const employee = await this.employeeRepository.findByPk(id);
            if (!employee) {
                throw this.errorMessageService.GeneralErrorCore('Employee not found', 404);
            }
            await this.employeeSalaryRepository.destroy({
                where: { employee_id: id },
            });
            const deleted = await this.employeeRepository.destroy({
                where: { id: id },
            });
            if (deleted) {
                return { message: 'Employee deleted successfully' };
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to delete Employee', 200);
            }
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
    __metadata("design:paramtypes", [Object, Object, sequelize_typescript_1.Sequelize,
        errormessage_service_1.ErrorMessageService,
        jwt_1.JwtService])
], EmployeeService);
//# sourceMappingURL=employeeManagement.service.js.map