"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsProvider = void 0;
const products_entity_1 = require("../entity/products.entity");
exports.ProductsProvider = [
    {
        provide: 'PRODUCTS_REPOSITORY',
        useValue: products_entity_1.Products,
    },
];
//# sourceMappingURL=products.provider.js.map