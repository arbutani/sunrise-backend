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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRequestDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ProductsRequestDto {
    name;
    description;
    selling_price;
    shipping_charge;
    mini_purchase;
    qty;
    country_id;
    reorder_qty;
}
exports.ProductsRequestDto = ProductsRequestDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Name is required' }),
    (0, class_validator_1.IsString)({ message: 'Name must be a string' }),
    __metadata("design:type", String)
], ProductsRequestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], ProductsRequestDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Selling price is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Selling price must be a valid number' }),
    (0, class_validator_1.IsPositive)({ message: 'Selling price must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductsRequestDto.prototype, "selling_price", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Shipping charge is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Shipping charge must be a valid number' }),
    (0, class_validator_1.IsPositive)({ message: 'Shipping charge must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductsRequestDto.prototype, "shipping_charge", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Minimum purchase is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum purchase must be a valid number' }),
    (0, class_validator_1.IsPositive)({ message: 'Minimum purchase must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductsRequestDto.prototype, "mini_purchase", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Quantity is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Quantity must be a valid number' }),
    (0, class_validator_1.IsPositive)({ message: 'Quantity must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductsRequestDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'Country ID must be a valid UUID' }),
    __metadata("design:type", String)
], ProductsRequestDto.prototype, "country_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Reorder quantity is required' }),
    (0, class_validator_1.IsNumber)({}, { message: 'Reorder quantity must be a valid number' }),
    (0, class_validator_1.IsPositive)({ message: 'Reorder quantity must be positive' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductsRequestDto.prototype, "reorder_qty", void 0);
//# sourceMappingURL=productsRequest.dto.js.map