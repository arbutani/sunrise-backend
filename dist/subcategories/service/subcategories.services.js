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
        try {
            const findCategory = await this.categoriesRepository.findOne({
                where: {
                    id: requestDto.category_id,
                },
            });
            if (!findCategory) {
                throw this.errorMessageService.GeneralErrorCore('Category not found.', 200);
            }
            const existingSubcategory = await this.subcategoriesRepository.findOne({
                where: {
                    name: requestDto.name,
                    category_id: requestDto.category_id,
                },
            });
            if (existingSubcategory) {
                throw this.errorMessageService.GeneralErrorCore('Subcategory with this name already exists in the specified category.', 200);
            }
            const fields = {
                category_id: requestDto.category_id,
                name: requestDto.name,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            const subcategory = await this.subcategoriesRepository.create(fields);
            if (subcategory) {
                return new subcategories_dto_1.SubcategoriesDto(subcategory);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to create subcategory.', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async update(id, requestDto) {
        try {
            const existingSubcategory = await this.subcategoriesRepository.findByPk(id);
            if (!existingSubcategory) {
                throw this.errorMessageService.GeneralErrorCore('Subcategory not found', 404);
            }
            if (requestDto.category_id &&
                requestDto.category_id !== existingSubcategory.category_id) {
                const newCategory = await this.categoriesRepository.findOne({
                    where: {
                        id: requestDto.category_id,
                    },
                });
                if (!newCategory) {
                    throw this.errorMessageService.GeneralErrorCore('New category not found', 200);
                }
            }
            if (requestDto.name) {
                const categoryIdToCheck = requestDto.category_id || existingSubcategory.category_id;
                const duplicateSubcategory = await this.subcategoriesRepository.findOne({
                    where: {
                        name: requestDto.name,
                        category_id: categoryIdToCheck,
                        id: { [sequelize_1.Op.ne]: id },
                    },
                });
                if (duplicateSubcategory) {
                    throw this.errorMessageService.GeneralErrorCore('Subcategory with this name already exists in the specified category', 200);
                }
            }
            const updateFields = {
                ...requestDto,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            await this.subcategoriesRepository.update(updateFields, {
                where: { id: id },
            });
            const updatedSubcategory = await this.subcategoriesRepository.findByPk(id);
            if (updatedSubcategory) {
                return new subcategories_dto_1.SubcategoriesDto(updatedSubcategory);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to retrieve updated subcategory', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async get(id, type = 'category_id') {
        let subcategories;
        if (type === 'id') {
            const subcategories = await this.subcategoriesRepository.findByPk(id);
            if (!subcategories) {
                throw this.errorMessageService.GeneralErrorCore('Subcategories not found', 404);
            }
            return [new subcategories_dto_1.SubcategoriesDto(subcategories)];
        }
        else {
            subcategories = await this.subcategoriesRepository.findAll({
                where: {
                    category_id: id,
                },
            });
            if (!subcategories || subcategories.length === 0) {
                throw this.errorMessageService.GeneralErrorCore('Subcategories not found', 404);
            }
            return subcategories.map((subcategories) => new subcategories_dto_1.SubcategoriesDto(subcategories));
        }
    }
    async deleteSubcategory(id) {
        try {
            const subcategory = await this.subcategoriesRepository.findByPk(id);
            if (!subcategory) {
                throw this.errorMessageService.GeneralErrorCore('Subcategory not found', 404);
            }
            const deleted = await this.subcategoriesRepository.destroy({
                where: { id: id },
            });
            if (deleted) {
                return { message: 'Subcategory deleted successfully' };
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Failed to delete subcategory', 200);
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getAllSubcategories(requestDto) {
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
                const listData = await Promise.all(results.map(async (subcategory) => {
                    if (subcategory['created_at']) {
                        subcategory['createdAt'] = (0, moment_1.default)(subcategory['created_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (subcategory['updated_at']) {
                        subcategory['updatedAt'] = (0, moment_1.default)(subcategory['updated_at']).format('DD-MM-YYYY HH:mm A');
                    }
                    return new subcategories_dto_1.SubcategoriesDto(subcategory);
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
                const subcategories = await this.subcategoriesRepository.findAll({
                    include: [
                        {
                            model: categories_entity_1.Categories,
                            attributes: ['id', 'name'],
                        },
                    ],
                });
                if (!subcategories || subcategories.length === 0) {
                    throw this.errorMessageService.GeneralErrorCore('No subcategories found', 404);
                }
                return subcategories.map((subcategory) => new subcategories_dto_1.SubcategoriesDto(subcategory));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async queryBuilder(requestDto) {
        try {
            const columns = ['id', 'category_id', 'name', 'created_at', 'updated_at'];
            let where = '';
            if (requestDto.category_id && requestDto.category_id != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` category_id='${requestDto.category_id}' `;
            }
            if (requestDto.name && requestDto.name != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` name ILIKE '%${requestDto.name}%' `;
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
                where = " id='" + requestDto.id + "' ";
            }
            let query = `SELECT * FROM subcategories`;
            let countQuery = `SELECT COUNT(*) as count FROM subcategories`;
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
                    orderBy += `${columns[order.column]} ${order.dir}`;
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
            return { query: query, count_query: countQuery };
        }
        catch (error) {
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