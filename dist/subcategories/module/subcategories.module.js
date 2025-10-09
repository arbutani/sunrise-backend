"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoriesModule = void 0;
const common_1 = require("@nestjs/common");
const subcategories_controller_1 = require("../controller/subcategories.controller");
const subcategories_provider_1 = require("../provider/subcategories.provider");
const subcategories_services_1 = require("../service/subcategories.services");
const categories_module_1 = require("../../categories/module/categories.module");
let SubcategoriesModule = class SubcategoriesModule {
};
exports.SubcategoriesModule = SubcategoriesModule;
exports.SubcategoriesModule = SubcategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => categories_module_1.CategoriesModule)],
        controllers: [subcategories_controller_1.SubcategoriesController],
        providers: [...subcategories_provider_1.SubcategoriesProvider, subcategories_services_1.SubcategoriesService],
        exports: [...subcategories_provider_1.SubcategoriesProvider],
    })
], SubcategoriesModule);
//# sourceMappingURL=subcategories.module.js.map