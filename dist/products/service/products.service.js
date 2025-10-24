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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const errormessage_service_1 = require("../../shared/services/errormessage.service");
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const products_dto_1 = require("../dto/products.dto");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ProductsService = class ProductsService {
    productRepository;
    sequelize;
    errorMessageService;
    constructor(productRepository, sequelize, errorMessageService) {
        this.productRepository = productRepository;
        this.sequelize = sequelize;
        this.errorMessageService = errorMessageService;
    }
    validateProductPhoto(file) {
        if (!file)
            return;
        const allowedExtensions = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp',
            '.gif',
            '.svg',
            '.tif',
            '.tiff',
            '.bmp',
        ];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            throw this.errorMessageService.GeneralErrorCore(`Invalid file type. Only ${allowedExtensions.join(', ')} are allowed.`, 400);
        }
    }
    async createProduct(requestDto, productPhoto) {
        try {
            this.validateProductPhoto(productPhoto);
        }
        catch (e) {
            if (productPhoto?.filename) {
                const projectRoot = path.resolve();
                const filePath = path.join(projectRoot, 'upload/photo', productPhoto.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw e;
        }
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        const photoFileName = productPhoto?.filename || '';
        try {
            const existingProduct = await this.productRepository.findOne({
                where: { name: requestDto.name },
                transaction: transaction,
            });
            if (existingProduct) {
                throw this.errorMessageService.GeneralErrorCore('Product with this name already exists', 200);
            }
            const lastProduct = await this.productRepository.findOne({
                order: [['createdAt', 'DESC']],
            });
            let nextSeriesNumber = 1;
            if (lastProduct && lastProduct.reference_number) {
                const match = lastProduct.reference_number.match(/[a-zA-Z](\d+)/);
                if (match && match[1]) {
                    const lastSeriesNumber = parseInt(match[1], 10);
                    if (!isNaN(lastSeriesNumber)) {
                        nextSeriesNumber = lastSeriesNumber + 1;
                    }
                }
            }
            const dateString = (0, moment_1.default)().format('DDMMYY');
            const newReferenceNumber = `P${nextSeriesNumber}-${dateString}`;
            const productFields = {
                reference_number: newReferenceNumber,
                reference_number_date: (0, moment_1.default)().format('YYYY-MM-DD'),
                name: requestDto.name,
                description: requestDto.description,
                selling_price: requestDto.selling_price,
                shipping_charge: requestDto.shipping_charge,
                mini_purchase: requestDto.mini_purchase,
                qty: requestDto.qty,
                country_id: requestDto.country_id,
                reorder_qty: requestDto.reorder_qty,
                photo: photoFileName,
                createdAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
                deletedAt: null,
            };
            let product = await this.productRepository.create(productFields, {
                transaction,
            });
            if (product) {
                product = product.dataValues ? product.dataValues : product;
                await transaction.commit();
                status = true;
                return new products_dto_1.ProductsDto(product);
            }
            else {
                throw this.errorMessageService.GeneralErrorCore('Unable to create product', 500);
            }
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
                if (photoFileName) {
                    const projectRoot = path.resolve();
                    const filePath = path.join(projectRoot, 'upload/photo', photoFileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async updateProduct(id, requestDto, productPhoto) {
        const UPLOAD_FOLDER = 'upload/photo';
        const projectRoot = path.resolve();
        const uploadDir = path.join(projectRoot, UPLOAD_FOLDER);
        try {
            this.validateProductPhoto(productPhoto);
        }
        catch (e) {
            if (productPhoto?.filename) {
                const filePath = path.join(uploadDir, productPhoto.filename);
                if (fs.existsSync(filePath))
                    fs.unlinkSync(filePath);
            }
            throw e;
        }
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        const newPhotoFileName = productPhoto?.filename || '';
        let oldPhotoFileName = '';
        try {
            const oldProduct = await this.productRepository.findByPk(id, {
                transaction,
                raw: true
            });
            if (!oldProduct) {
                if (newPhotoFileName) {
                    const filePath = path.join(uploadDir, newPhotoFileName);
                    if (fs.existsSync(filePath))
                        fs.unlinkSync(filePath);
                }
                throw this.errorMessageService.GeneralErrorCore('Product not found', 404);
            }
            oldPhotoFileName = oldProduct.photo || '';
            if (requestDto.name && requestDto.name !== oldProduct.name) {
                const existingProduct = await this.productRepository.findOne({
                    where: {
                        name: requestDto.name,
                        id: { [sequelize_1.Op.ne]: id }
                    },
                    transaction,
                });
                if (existingProduct) {
                    if (newPhotoFileName) {
                        const filePath = path.join(uploadDir, newPhotoFileName);
                        if (fs.existsSync(filePath))
                            fs.unlinkSync(filePath);
                    }
                    throw this.errorMessageService.GeneralErrorCore('Product with this name already exists', 200);
                }
            }
            const updateFields = {
                name: requestDto.name,
                description: requestDto.description,
                selling_price: requestDto.selling_price,
                shipping_charge: requestDto.shipping_charge,
                mini_purchase: requestDto.mini_purchase,
                qty: requestDto.qty,
                country_id: requestDto.country_id,
                reorder_qty: requestDto.reorder_qty,
                updatedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'),
            };
            if (newPhotoFileName) {
                updateFields.photo = newPhotoFileName;
            }
            const [updateCount] = await this.productRepository.update(updateFields, {
                where: { id },
                transaction,
            });
            if (updateCount === 0) {
                throw this.errorMessageService.GeneralErrorCore('Failed to update product', 500);
            }
            await transaction.commit();
            status = true;
            if (newPhotoFileName && oldPhotoFileName && newPhotoFileName !== oldPhotoFileName) {
                const oldFilePath = path.join(uploadDir, oldPhotoFileName);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        fs.unlinkSync(oldFilePath);
                    }
                    catch (deleteError) {
                        console.error(`Failed to delete old photo: ${oldPhotoFileName}`, deleteError);
                    }
                }
            }
            const updatedProduct = await this.productRepository.findByPk(id);
            return new products_dto_1.ProductsDto(updatedProduct);
        }
        catch (error) {
            if (!status) {
                await transaction.rollback().catch(() => { });
                if (newPhotoFileName) {
                    const filePath = path.join(uploadDir, newPhotoFileName);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async getProduct(id) {
        try {
            let product = await this.productRepository.findByPk(id);
            if (!product) {
                throw this.errorMessageService.GeneralErrorCore('Product not found', 404);
            }
            product = product.dataValues ? product.dataValues : product;
            return new products_dto_1.ProductsDto(product);
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
            const columns = [
                'id',
                'reference_number',
                'name',
                'selling_price',
                'qty',
                'createdAt',
            ];
            let where = 'deleted_at IS NULL';
            if (requestDto.search && requestDto.search.value) {
                const search = requestDto.search.value;
                if (search != '') {
                    const searchableColumns = [
                        'reference_number',
                        'name',
                        'selling_price',
                    ];
                    const searchConditions = [];
                    for (const col of searchableColumns) {
                        searchConditions.push(`"${col}" ILIKE '%${search}%'`);
                    }
                    if (searchConditions.length > 0) {
                        where += ` AND (${searchConditions.join(' OR ')})`;
                    }
                }
            }
            if (requestDto.name && requestDto.name != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` "name" ILIKE '%${requestDto.name}%' `;
            }
            if (requestDto.country_id && requestDto.country_id != '') {
                if (where != '') {
                    where += ` AND `;
                }
                where += ` "country_id" = '${requestDto.country_id}' `;
            }
            let query = `SELECT * FROM products`;
            let countQuery = `SELECT COUNT(*) FROM products`;
            if (where != '') {
                query += ` WHERE ${where}`;
                countQuery += ` WHERE ${where}`;
            }
            let orderBy = '';
            if (requestDto.order && requestDto.order.length > 0) {
                const order = requestDto.order[0];
                const columnName = columns[order.column] || 'created_at';
                orderBy = `"${columnName}" ${order.dir}`;
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
    async getAllProducts(requestDto) {
        try {
            if (requestDto && Object.keys(requestDto).length > 0) {
                const { query, count_query } = await this.queryBuilder(requestDto);
                const [count] = await this.sequelize.query(count_query, { raw: true });
                const countRows = count;
                const [results] = await this.sequelize.query(query, { raw: true });
                const listData = results.map((product) => {
                    if (product['createdAt']) {
                        product['createdAt'] = (0, moment_1.default)(product['createdAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (product['updatedAt']) {
                        product['updatedAt'] = (0, moment_1.default)(product['updatedAt']).format('DD-MM-YYYY HH:mm A');
                    }
                    if (product['reference_number_date']) {
                        product['reference_number_date'] = (0, moment_1.default)(product['reference_number_date']).format('DD-MM-YYYY');
                    }
                    return product;
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
                const products = await this.productRepository.findAll({
                    where: (0, sequelize_1.literal)('deleted_at IS NULL'),
                });
                if (!products || products.length === 0) {
                    throw this.errorMessageService.GeneralErrorCore('No products found', 404);
                }
                return products.map((product) => new products_dto_1.ProductsDto(product));
            }
        }
        catch (error) {
            throw this.errorMessageService.CatchHandler(error);
        }
    }
    async deleteProduct(id) {
        const transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        });
        let status = false;
        let productPhotoName = '';
        try {
            const productToDelete = await this.productRepository.findByPk(id, { transaction });
            if (!productToDelete) {
                throw this.errorMessageService.GeneralErrorCore('Product not found', 404);
            }
            productPhotoName = productToDelete.photo;
            const [updatedRows] = await this.productRepository.update({ deletedAt: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss') }, {
                where: {
                    id: id,
                    deletedAt: { [sequelize_1.Op.is]: null },
                },
                transaction: transaction,
            });
            if (updatedRows === 0) {
                throw this.errorMessageService.GeneralErrorCore('Product not found or already deleted', 404);
            }
            if (productPhotoName) {
                const projectRoot = path.resolve();
                const productPicPath = path.join(projectRoot, 'upload/photo', productPhotoName);
                if (fs.existsSync(productPicPath)) {
                    fs.unlinkSync(productPicPath);
                }
            }
            await transaction.commit();
            status = true;
            return { message: 'Product deleted successfully' };
        }
        catch (error) {
            if (status == false) {
                await transaction.rollback().catch(() => { });
            }
            throw this.errorMessageService.CatchHandler(error);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCTS_REPOSITORY')),
    __param(1, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object, sequelize_1.Sequelize,
        errormessage_service_1.ErrorMessageService])
], ProductsService);
//# sourceMappingURL=products.service.js.map