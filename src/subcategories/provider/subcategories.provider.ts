/* eslint-disable prettier/prettier */

import { Subcategories } from '../entity/subcategories.entity';

export const SubcategoriesProvider = [
  {
    provide: 'SUBCATEGORIES_REPOSITORY',
    useValue: Subcategories,
  },
];
