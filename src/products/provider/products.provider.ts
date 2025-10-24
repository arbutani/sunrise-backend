/* eslint-disable prettier/prettier */
import { Products } from "../entity/products.entity";
export const ProductsProvider = [
  {
    provide: 'PRODUCTS_REPOSITORY',
    useValue: Products,
  },
];
