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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const categories_dto_1 = require("../dto/categories.dto");
const subcategories_entity_1 = require("../../subcategories/entity/subcategories.entity");
const subcategories_dto_1 = require("../../subcategories/dto/subcategories.dto");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    subcategoriesRepository;
    sequelize;
    errorMessageService;
    constructor(categoriesRepository, subcategoriesRepository, sequelize, errorMessageService) {
        this.categoriesRepository = categoriesRepository;
        this.subcategoriesRepository = subcategoriesRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
    }
    async createCategory(requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const existingCategory = await this.categoriesRepository.findOne({
                where: { name: requestDto.name, deletedAt: { [sequelize_1.Op.is]: null } },
                transaction,
            });
            if (existingCategory) {
                throw this.errorMessageService.GeneralErrorCore('Category with this name already exists', 200);
            }
            const categoryFields = {
                name: requestDto.name,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                deletedAt: null,
            };
            let category = await this.categoriesRepository.create(categoryFields, {
                transaction,
            });
            category = category.dataValues ? category.dataValues : category;
            const subcategoriesList = [];
            if (requestDto.subcategories &&
                Array.isArray(requestDto.subcategories) &&
                requestDto.subcategories.length > 0) {
                for (const sub of requestDto.subcategories) {
                    const subcategoryData = {
                        category_id: category.id,
                        name: sub.name,
                        createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                        updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                        deletedAt: null,
                    };
                    const subcategory = await this.subcategoriesRepository.create(subcategoryData, { transaction });
                    subcategoriesList.push(subcategory);
                }
            }
            category['subcategories'] = subcategoriesList;
            await transaction.commit();
            status = true;
            return new categories_dto_1.CategoriesDto(category);
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getCategory(id) {
        try {
            const category = await this.categoriesRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                include: [
                    {
                        model: subcategories_entity_1.Subcategories,
                        required: false,
                        where: { deletedAt: { [sequelize_1.Op.is]: null } },
                    },
                ],
                subQuery: false,
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            const categoryPlain = category.get({ plain: true });
            let subcategory = null;
            if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
                subcategory = new subcategories_dto_1.SubcategoriesDto(categoryPlain.subcategories[0]);
            }
            const responseData = {
                ...categoryPlain,
                subcategories: subcategory,
            };
            return new categories_dto_1.CategoriesDto(responseData);
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteCategory(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const deletedAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
            const [updatedRows] = await this.categoriesRepository.update({ deletedAt: deletedAt }, {
                where: {
                    id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            if (updatedRows === 0) {
                throw new common_1.NotFoundException('Category not found or already deleted');
            }
            await this.subcategoriesRepository.update({ deletedAt: deletedAt }, {
                where: {
                    category_id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            await transaction.commit();
            status = true;
            return { message: 'Category and related subcategories deleted successfully' };
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
                'name',
                'created_at',
                'updated_at',
            ];
            let where = 'deleted_at IS NULL';
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
                        if (where != '') {
                            where += ` AND `;
                        }
                        where += ` (${searchConditions.join(' OR ')}) `;
                    }
                }
            }
            if (requestDto.name && requestDto.name != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` name ILIKE '%${requestDto.name}%' `;
            }
            let query = `SELECT * FROM categories`;
            let countQuery = `SELECT COUNT(*) FROM categories`;
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
    async getAllCategories(requestDto) {
        try {
            if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count] = await this.sequelize.query(count_query, { raw: true });
                const countRows = count;
                const [results] = await this.sequelize.query(query, { raw: true });
                const listData = results.map((category) => {
                    if (category['created_at']) {
                        category['created_at'] = (0, moment_1.default)(category['created_at']).format('DD-MM-YYYY hh:mm A');
                    }
                    if (category['updated_at']) {
                        category['updated_at'] = (0, moment_1.default)(category['updated_at']).format('DD-MM-YYYY hh:mm A');
                    }
                    return category;
                });
                return {
                    recordsTotal: Number(countRows.length > 0 && countRows[0]['count'] !== ''
                        ? countRows[0]['count']
                        : 0),
                    recordsFiltered: listData.length,
                    data: listData,
                };
            }
            else {
                const categories = await this.categoriesRepository.findAll({
                    where: { deletedAt: { [sequelize_1.Op.eq]: null } },
                    include: [
                        {
                            model: subcategories_entity_1.Subcategories,
                            required: false,
                            where: { deletedAt: { [sequelize_1.Op.is]: null } },
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
                if (!categories || categories.length === 0) {
                    throw new common_1.NotFoundException('No categories found');
                }
                return categories.map((category) => {
                    const categoryPlain = category.get({ plain: true });
                    let subcategory = null;
                    if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
                        subcategory = new subcategories_dto_1.SubcategoriesDto(categoryPlain.subcategories[0]);
                    }
                    categoryPlain.subcategories = subcategory;
                    return new categories_dto_1.CategoriesDto(categoryPlain);
                });
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async updateCategory(id, requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const oldCategory = await this.categoriesRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                transaction,
            });
            if (!oldCategory) {
                throw new common_1.NotFoundException('Category not found');
            }
            const oldCategoryPlain = oldCategory.dataValues ? oldCategory.dataValues : oldCategory;
            if (requestDto.name && requestDto.name !== oldCategoryPlain.name) {
                const existingCategory = await this.categoriesRepository.findOne({
                    where: {
                        name: requestDto.name,
                        deletedAt: { [sequelize_1.Op.is]: null },
                        id: { [sequelize_1.Op.ne]: id },
                    },
                    transaction,
                });
                if (existingCategory) {
                    throw this.errorMessageService.GeneralErrorCore('Category with this name already exists', 200);
                }
            }
            const categoryFields = {
                name: requestDto.name,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const [updateCount] = await this.categoriesRepository.update(categoryFields, {
                where: { id },
                transaction,
            });
            if (updateCount === 0) {
                throw this.errorMessageService.GeneralErrorCore('Failed to update category', 500);
            }
            if (requestDto.subcategories && Array.isArray(requestDto.subcategories) && requestDto.subcategories.length > 0) {
                const existingSubcategories = await this.subcategoriesRepository.findAll({
                    where: {
                        category_id: id,
                        deletedAt: { [sequelize_1.Op.is]: null }
                    },
                    transaction,
                });
                const existingSubcategoriesPlain = existingSubcategories.map(sub => sub.dataValues ? sub.dataValues : sub);
                for (const sub of requestDto.subcategories) {
                    const existingSub = existingSubcategoriesPlain.find(existing => existing.name === sub.name);
                    if (!existingSub) {
                        const subcategoryData = {
                            category_id: id,
                            name: sub.name,
                            createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                            updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                            deletedAt: null,
                        };
                        await this.subcategoriesRepository.create(subcategoryData, { transaction });
                    }
                }
            }
            await transaction.commit();
            status = true;
            const updatedCategory = await this.categoriesRepository.findOne({
                where: { id: id, deletedAt: { [sequelize_1.Op.is]: null } },
                include: [
                    {
                        model: subcategories_entity_1.Subcategories,
                        required: false,
                        where: { deletedAt: { [sequelize_1.Op.is]: null } },
                    },
                ],
            });
            if (!updatedCategory) {
                throw this.errorMessageService.GeneralErrorCore('Failed to fetch updated category', 500);
            }
            let categoryPlain = updatedCategory.get({ plain: true });
            if (categoryPlain.subcategories && categoryPlain.subcategories.length > 0) {
                categoryPlain.subcategories = categoryPlain.subcategories.map((sub) => new subcategories_dto_1.SubcategoriesDto(sub));
            }
            return new categories_dto_1.CategoriesDto(categoryPlain);
        }
        catch (error) {
            if (status === false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CATEGORIES_REPOSITORY')),
    __param(1, (0, common_1.Inject)('SUBCATEGORIES_REPOSITORY')),
    __param(2, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, Object, sequelize_1.Sequelize,
        errormessage_service_1.ErrorMessageService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map