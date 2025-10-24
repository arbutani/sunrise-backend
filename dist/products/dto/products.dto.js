"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsDto = void 0;
const moment_1 = __importDefault(require("moment"));
class ProductsDto {
    id;
    name;
    description;
    selling_price;
    shipping_charge;
    mini_purchase;
    qty;
    country_id;
    reorder_qty;
    photo;
    reference_number;
    reference_number_date;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(data) {
        data = data.dataValues ? data.dataValues : data;
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.selling_price = data.selling_price;
        this.shipping_charge = data.shipping_charge;
        this.mini_purchase = data.mini_purchase;
        this.qty = data.qty;
        this.country_id = data.country_id;
        this.reorder_qty = data.reorder_qty;
        this.photo = data.photo;
        this.reference_number = data.reference_number;
        this.reference_number_date = data.reference_number_date;
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
        }
    }
}
exports.ProductsDto = ProductsDto;
//# sourceMappingURL=products.dto.js.map