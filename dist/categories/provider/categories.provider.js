"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesProvider = void 0;
const categories_entity_1 = require("../entity/categories.entity");
exports.CategoriesProvider = [
    {
        provide: 'CATEGORIES_REPOSITORY',
        useValue: categories_entity_1.Categories,
    },
];
//# sourceMappingURL=categories.provider.js.map