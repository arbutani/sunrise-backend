"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const categories_provider_1 = require("../provider/categories.provider");
const categories_service_1 = require("../service/categories.service");
const categories_controller_1 = require("../controller/categories.controller");
const subcategories_module_1 = require("../../subcategories/module/subcategories.module");
let CategoriesModule = class CategoriesModule {
};
exports.CategoriesModule = CategoriesModule;
exports.CategoriesModule = CategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => subcategories_module_1.SubcategoriesModule)],
        controllers: [categories_controller_1.CategoriesController],
        providers: [...categories_provider_1.CategoriesProvider, categories_service_1.CategoriesService],
        exports: [...categories_provider_1.CategoriesProvider],
    })
], CategoriesModule);
//# sourceMappingURL=categories.module.js.map