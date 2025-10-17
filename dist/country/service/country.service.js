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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const country_dto_1 = require("../dto/country.dto");
let CountryService = class CountryService {
    countryRepository;
    sequelize;
    errorMessageService;
    constructor(countryRepository, sequelize, errorMessageService) {
        this.countryRepository = countryRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
    }
    async createCountry(requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const existingCountry = await this.countryRepository.findOne({
                where: {
                    country_name: requestDto.country_name,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction,
            });
            if (existingCountry) {
                throw this.errorMessageService.GeneralErrorCore('Country with this name already exists', 200);
            }
            const countryFields = {
                country_name: requestDto.country_name,
                currency_code: requestDto.currency_code,
                conversion_rate: requestDto.conversion_rate,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                deletedAt: null,
            };
            let country = await this.countryRepository.create(countryFields, {
                transaction,
            });
            country = country.dataValues ? country.dataValues : country;
            await transaction.commit();
            status = true;
            return new country_dto_1.CountryDto(country);
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getCountry(id) {
        try {
            const country = await this.countryRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
            });
            if (!country) {
                throw new common_1.NotFoundException('Country not found');
            }
            return new country_dto_1.CountryDto(country);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteCountry(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const deletedAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const [updatedRows] = await this.countryRepository.update({ deletedAt: deletedAt }, {
                where: {
                    id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            if (updatedRows === 0) {
                throw new common_1.NotFoundException('Country not found or already deleted');
            }
            await transaction.commit();
            status = true;
            return { message: 'Country deleted successfully' };
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async queryBuilder(requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const columns = [
                'id',
                'country_name',
                'currency_code',
                'conversion_rate',
                'created_at',
                'updated_at',
            ];
            let where = 'deleted_at IS NULL';
            if (requestDto.search && requestDto.search.value) {
                const search = requestDto.search.value;
                if (search != '') {
                    const searchConditions = [];
                    for (const column of requestDto.columns) {
                        const columnIndex = Number(column.data);
                        if (column.searchable != null && column.searchable == 'true' && columns[columnIndex]) {
                            searchConditions.push(` ${columns[columnIndex]} ILIKE '%${search}%' `);
                        }
                    }
                    if (searchConditions.length > 0) {
                        if (where != '') {
                            where += ` AND `;
                        }
                        where += ` (${searchConditions.join(' OR ')}) `;
                    }
                }
            }
            if (requestDto.country_name && requestDto.country_name != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` country_name ILIKE '%${requestDto.country_name}%' `;
            }
            let query = `SELECT * FROM countries`;
            let countQuery = `SELECT COUNT(*) FROM countries`;
            if (where != '') {
                query += ` WHERE ${where}`;
                countQuery += ` WHERE ${where}`;
            }
            let orderBy = '';
            if (requestDto.order && requestDto.order.length > 0) {
                const order = requestDto.order[0];
                const orderColumnIndex = Number(order.column);
                if (columns[orderColumnIndex]) {
                    orderBy = `${columns[orderColumnIndex]} ${order.dir}`;
                }
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
            await transaction.commit();
            status = true;
            return { query: query, count_query: countQuery };
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getAllCountries(requestDto) {
        try {
            if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count] = await this.sequelize.query(count_query, { raw: true });
                const countRows = count;
                const [results] = await this.sequelize.query(query, { raw: true });
                const listData = results.map((country) => {
                    if (country['created_at']) {
                        country['created_at'] = (0, moment_1.default)(country['created_at']).format('DD-MM-YYYY hh:mm A');
                    }
                    if (country['updated_at']) {
                        country['updated_at'] = (0, moment_1.default)(country['updated_at']).format('DD-MM-YYYY hh:mm A');
                    }
                    return country;
                });
                return {
                    recordsTotal: Number(countRows.length > 0 && countRows[0]['count'] !== '' ? countRows[0]['count'] : 0),
                    recordsFiltered: listData.length,
                    data: listData,
                };
            }
            else {
                const countries = await this.countryRepository.findAll({
                    where: { deletedAt: { [sequelize_1.Op.eq]: null } },
                    order: [['createdAt', 'DESC']],
                });
                if (!countries || countries.length === 0) {
                    throw new common_1.NotFoundException('No countries found');
                }
                return countries.map((country) => {
                    const countryPlain = country.get({ plain: true });
                    return new country_dto_1.CountryDto(countryPlain);
                });
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async updateCountry(id, requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const oldCountry = await this.countryRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                transaction,
            });
            if (!oldCountry) {
                throw new common_1.NotFoundException('Country not found');
            }
            const oldCountryPlain = oldCountry.dataValues ? oldCountry.dataValues : oldCountry;
            if (requestDto.country_name && requestDto.country_name !== oldCountryPlain.country_name) {
                const existingCountry = await this.countryRepository.findOne({
                    where: {
                        country_name: requestDto.country_name,
                        deletedAt: { [sequelize_1.Op.is]: null },
                        id: { [sequelize_1.Op.ne]: id },
                    },
                    transaction,
                });
                if (existingCountry) {
                    throw this.errorMessageService.GeneralErrorCore('Country with this name already exists', 200);
                }
            }
            const countryFields = {
                country_name: requestDto.country_name,
                currency_code: requestDto.currency_code,
                conversion_rate: requestDto.conversion_rate,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const [updateCount] = await this.countryRepository.update(countryFields, {
                where: { id },
                transaction,
            });
            if (updateCount === 0) {
                throw this.errorMessageService.GeneralErrorCore('Failed to update country', 500);
            }
            await transaction.commit();
            status = true;
            const updatedCountry = await this.countryRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
            });
            if (!updatedCountry) {
                throw this.errorMessageService.GeneralErrorCore('Failed to fetch updated country', 500);
            }
            return new country_dto_1.CountryDto(updatedCountry);
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('COUNTRY_REPOSITORY')),
    __param(1, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, sequelize_1.Sequelize,
        errormessage_service_1.ErrorMessageService])
], CountryService);
//# sourceMappingURL=country.service.js.map