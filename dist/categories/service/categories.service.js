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
                where: { name: requestDto.name },
                transaction: transaction,
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
            const category = await this.categoriesRepository.create(categoryFields, {
                transaction,
            });
            await transaction.commit();
            status = true;
            const newCategory = await this.categoriesRepository.findByPk(category.id);
            if (!newCategory) {
                throw this.errorMessageService.GeneralErrorCore('Failed to fetch created category', 500);
            }
            return new categories_dto_1.CategoriesDto(newCategory);
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async updateCategory(id, requestDto) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const oldCategory = await this.categoriesRepository.findByPk(id, {
                transaction: transaction,
            });
            if (!oldCategory) {
                throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
            }
            if (requestDto.name !== oldCategory.name) {
                const findCategory = await this.categoriesRepository.findOne({
                    where: {
                        name: requestDto.name,
                        id: { [sequelize_1.Op.ne]: id },
                    },
                    transaction: transaction,
                });
                if (findCategory) {
                    throw this.errorMessageService.GeneralErrorCore('Category with this name already exists', 200);
                }
            }
            const categoryFields = {
                name: requestDto.name,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const [updatedCount] = await this.categoriesRepository.update(categoryFields, { where: { id }, transaction });
            if (updatedCount === 0) {
                throw this.errorMessageService.GeneralErrorCore('Failed to update category', 200);
            }
            await transaction.commit();
            status = true;
            const updatedCategory = await this.categoriesRepository.findByPk(id);
            if (!updatedCategory) {
                throw this.errorMessageService.GeneralErrorCore('Failed to fetch updated category', 500);
            }
            return new categories_dto_1.CategoriesDto(updatedCategory);
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getCategory(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const category = await this.categoriesRepository.findByPk(id, {
                include: [
                    {
                        model: this.subcategoriesRepository,
                        where: { deletedAt: null },
                        required: false,
                    },
                ],
                transaction: transaction,
            });
            if (!category) {
                throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
            }
            await transaction.commit();
            status = true;
            return new categories_dto_1.CategoriesDto(category);
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
            const columns = ['id', 'name', 'createdAt'];
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
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            if (requestDto && Object.keys(requestDto).length > 0) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count] = await this.sequelize.query(count_query, {
                    raw: true,
                    transaction: transaction,
                });
                const countRows = count;
                const [results] = await this.sequelize.query(query, {
                    raw: true,
                    transaction: transaction,
                });
                const listData = await Promise.all(results.map(async (category) => {
                    if (category['created_at']) {
                        category['createdAt'] = (0, moment_1.default)(category['created_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (category['updated_at']) {
                        category['updatedAt'] = (0, moment_1.default)(category['updated_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    return category;
                }));
                await transaction.commit();
                status = true;
                return {
                    recordsTotal: Number(countRows.length > 0 && countRows[0]['count'] != ''
                        ? countRows[0]['count']
                        : 0),
                    recordsFiltered: listData.length,
                    data: listData,
                };
            }
            else {
                const categories = await this.categoriesRepository.findAll({
                    where: {
                        deletedAt: { [sequelize_1.Op.is]: null },
                    },
                    include: [
                        {
                            model: this.subcategoriesRepository,
                            where: { deletedAt: null },
                            required: false,
                        },
                    ],
                    transaction: transaction,
                });
                if (!categories || categories.length === 0) {
                    throw this.errorMessageService.GeneralErrorCore('No categories found', 404);
                }
                await transaction.commit();
                status = true;
                return categories.map((category) => new categories_dto_1.CategoriesDto(category));
            }
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteCategory(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        try {
            const [updatedRows] = await this.categoriesRepository.update({ deletedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss') }, {
                where: {
                    id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            if (updatedRows === 0) {
                throw this.errorMessageService.GeneralErrorCore('Category not found', 404);
            }
            await transaction.commit();
            status = true;
            return { message: 'Category deleted successfully' };
        }
        catch (error) {
            if (status == false) {
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