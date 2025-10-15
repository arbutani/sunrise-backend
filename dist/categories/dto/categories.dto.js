"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesDto = void 0;
const moment_1 = __importDefault(require("moment"));
const subcategories_dto_1 = require("../../subcategories/dto/subcategories.dto");
class CategoriesDto {
    id;
    name;
    createdAt;
    updatedAt;
    deletedAt;
    subcategories;
    constructor(data) {
        data = data.dataValues ? data.dataValues : data;
        this.id = data.id;
        this.name = data.name;
        const createdAt = data.createdAt
            ? data.createdAt
            : data.created_at
                ? data.created_at
                : '';
        const updatedAt = data.updatedAt
            ? data.updatedAt
            : data.updated_at
                ? data.updated_at
                : '';
        const deletedAt = data.deletedAt
            ? data.deletedAt
            : data.deleted_at
                ? data.deleted_at
                : '';
        if (createdAt) {
            this.createdAt = (0, moment_1.default)(createdAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
        }
        if (updatedAt) {
            this.updatedAt = (0, moment_1.default)(updatedAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
        }
        if (deletedAt) {
            this.deletedAt = (0, moment_1.default)(deletedAt, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY hh:mm A');
            if (data.subcategories) {
                this.subcategories = new subcategories_dto_1.SubcategoriesDto(data.subcategories);
            }
        }
    }
}
exports.CategoriesDto = CategoriesDto;
//# sourceMappingURL=categories.dto.js.map