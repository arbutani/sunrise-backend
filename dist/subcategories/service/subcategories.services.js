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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const categories_entity_1 = require("../../categories/entity/categories.entity");
const subcategories_dto_1 = require("../dto/subcategories.dto");
let SubcategoriesService = class SubcategoriesService {
    subcategoriesRepository;
    categoriesRepository;
    sequelize;
    errorMessageService;
    constructor(subcategoriesRepository, categoriesRepository, sequelize, errorMessageService) {
        this.subcategoriesRepository = subcategoriesRepository;
        this.categoriesRepository = categoriesRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
    }
    async create(requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const findCategory = await this.categoriesRepository.findOne({
                where: {
                    id: requestDto.category_id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction,
            });
            if (!findCategory) {
                throw new common_1.NotFoundException('Category not found or is deleted.');
            }
            const existingSubcategory = await this.subcategoriesRepository.findOne({
                where: {
                    name: requestDto.name,
                    category_id: requestDto.category_id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction,
            });
            if (existingSubcategory) {
                throw this.errorMessageService.GeneralErrorCore('Subcategory with this name already exists in the specified category', 200);
            }
            const fields = {
                category_id: requestDto.category_id,
                name: requestDto.name,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                deletedAt: null,
            };
            const subcategory = await this.subcategoriesRepository.create(fields, {
                transaction,
            });
            await transaction.commit();
            status = true;
            return new subcategories_dto_1.SubcategoriesDto(subcategory);
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async update(id, requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const existingSubcategory = await this.subcategoriesRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                transaction,
            });
            if (!existingSubcategory) {
                throw new common_1.NotFoundException('Subcategory not found or is deleted');
            }
            const categoryIdToCheck = requestDto.category_id || existingSubcategory.category_id;
            const nameToCheck = requestDto.name || existingSubcategory.name;
            if (requestDto.category_id && requestDto.category_id !== existingSubcategory.category_id) {
                const newCategory = await this.categoriesRepository.findOne({
                    where: {
                        id: requestDto.category_id,
                        deletedAt: { [sequelize_1.Op.is]: null },
                    },
                    transaction,
                });
                if (!newCategory) {
                    throw new common_1.NotFoundException('New category not found or is deleted');
                }
            }
            if (requestDto.name || requestDto.category_id) {
                const duplicateSubcategory = await this.subcategoriesRepository.findOne({
                    where: {
                        name: nameToCheck,
                        category_id: categoryIdToCheck,
                        id: { [sequelize_1.Op.ne]: id },
                        deletedAt: { [sequelize_1.Op.is]: null },
                    },
                    transaction,
                });
                if (duplicateSubcategory) {
                    throw this.errorMessageService.GeneralErrorCore('Subcategory with this name already exists in the specified category', 200);
                }
            }
            const updateFields = {
                ...requestDto,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const [updateCount] = await this.subcategoriesRepository.update(updateFields, {
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                transaction,
            });
            if (updateCount === 0) {
                throw new common_1.NotFoundException('Subcategory not found or update failed');
            }
            await transaction.commit();
            status = true;
            const updatedSubcategory = await this.subcategoriesRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                include: [
                    {
                        model: categories_entity_1.Categories,
                        attributes: ['id', 'name'],
                    },
                ],
            });
            if (updatedSubcategory) {
                return new subcategories_dto_1.SubcategoriesDto(updatedSubcategory);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to retrieve updated subcategory', 500);
            }
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async get(id, type = 'category_id') {
        try {
            if (type === 'id') {
                const subcategory = await this.subcategoriesRepository.findOne({
                    where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                    include: [
                        {
                            model: categories_entity_1.Categories,
                            attributes: ['id', 'name'],
                            required: false,
                            where: { deletedAt: { [sequelize_1.Op.is]: null } },
                        },
                    ],
                });
                if (!subcategory) {
                    throw new common_1.NotFoundException('Subcategory not found or is deleted');
                }
                return new subcategories_dto_1.SubcategoriesDto(subcategory);
            }
            else {
                const subcategories = await this.subcategoriesRepository.findAll({
                    where: {
                        category_id: id,
                        deletedAt: { [sequelize_1.Op.is]: null },
                    },
                    include: [
                        {
                            model: categories_entity_1.Categories,
                            attributes: ['id', 'name'],
                            required: false,
                            where: { deletedAt: { [sequelize_1.Op.is]: null } },
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
                if (!subcategories || subcategories.length === 0) {
                    throw new common_1.NotFoundException('Subcategories not found for the given category');
                }
                return subcategories.map((subcategory) => new subcategories_dto_1.SubcategoriesDto(subcategory));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getAllSubcategories(requestDto) {
        try {
            if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count] = await this.sequelize.query(count_query, { raw: true });
                const countRows = count;
                const [results] = await this.sequelize.query(query, {
                    raw: true,
                });
                const listData = await Promise.all(results.map(async (subcategory) => {
                    if (subcategory['created_at']) {
                        subcategory['createdAt'] = (0, moment_1.default)(subcategory['created_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (subcategory['updated_at']) {
                        subcategory['updatedAt'] = (0, moment_1.default)(subcategory['updated_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (subcategory.category_id) {
                        const category = await this.categoriesRepository.findOne({
                            where: { id: subcategory.category_id, deletedAt: { [sequelize_1.Op.is]: null } },
                            attributes: ['id', 'name'],
                        });
                        subcategory.category = category ? category.get({ plain: true }) : null;
                    }
                    return new subcategories_dto_1.SubcategoriesDto(subcategory);
                }));
                return {
                    recordsTotal: Number(countRows.length > 0 && countRows[0]['count'] !== ''
                        ? countRows[0]['count']
                        : 0),
                    recordsFiltered: listData.length,
                    data: listData,
                };
            }
            else {
                const subcategories = await this.subcategoriesRepository.findAll({
                    where: { deletedAt: { [sequelize_1.Op.is]: null } },
                    include: [
                        {
                            model: categories_entity_1.Categories,
                            attributes: ['id', 'name'],
                            required: false,
                            where: { deletedAt: { [sequelize_1.Op.is]: null } },
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
                if (!subcategories || subcategories.length === 0) {
                    throw new common_1.NotFoundException('No subcategories found');
                }
                return subcategories.map((subcategory) => new subcategories_dto_1.SubcategoriesDto(subcategory));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async queryBuilder(requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const columns = ['id', 'category_id', 'name', 'created_at', 'updated_at'];
            let where = 'deleted_at IS NULL';
            if (requestDto.category_id && requestDto.category_id != '') {
                where += ` AND category_id='${requestDto.category_id}' `;
            }
            if (requestDto.name && requestDto.name != '') {
                where += ` AND name ILIKE '%${requestDto.name}%' `;
            }
            if (requestDto.search && requestDto.search.value) {
                const search = requestDto.search.value;
                if (search != '') {
                    let searchConditions = [];
                    for (const column of requestDto.columns) {
                        const columnIndex = Number(column.data);
                        if (column.searchable != null && column.searchable == 'true' && columns[columnIndex]) {
                            searchConditions.push(` ${columns[columnIndex]} ILIKE '%${search}%' `);
                        }
                    }
                    if (searchConditions.length > 0) {
                        where += ` AND (${searchConditions.join(' OR ')}) `;
                    }
                }
            }
            if (requestDto.id != null && requestDto.id != '') {
                where += ` AND id='${requestDto.id}' `;
            }
            let query = `SELECT subcategories.* FROM subcategories 
                  JOIN categories ON subcategories.category_id = categories.id`;
            let countQuery = `SELECT COUNT(subcategories.id) as count FROM subcategories 
                        JOIN categories ON subcategories.category_id = categories.id`;
            where += ` AND categories.deleted_at IS NULL`;
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
                orderBy = 'subcategories.created_at DESC';
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
    async deleteSubcategory(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const deletedAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const [updatedRows] = await this.subcategoriesRepository.update({ deletedAt: deletedAt }, {
                where: {
                    id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            if (updatedRows === 0) {
                throw new common_1.NotFoundException('Subcategory not found or already deleted');
            }
            await transaction.commit();
            status = true;
            return { message: 'Subcategory deleted successfully' };
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUBCATEGORIES_REPOSITORY')),
    __param(1, (0, common_1.Inject)('CATEGORIES_REPOSITORY')),
    __param(2, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, Object, sequelize_1.Sequelize,
        errormessage_service_1.ErrorMessageService])
], SubcategoriesService);
//# sourceMappingURL=subcategories.services.js.map