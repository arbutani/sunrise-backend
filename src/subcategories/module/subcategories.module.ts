/* eslint-disable prettier/prettier */

import { forwardRef, Module } from '@nestjs/common';
import { SubcategoriesController } from '../controller/subcategories.controller';
import { SubcategoriesProvider } from '../provider/subcategories.provider';
import { SubcategoriesService } from '../service/subcategories.services';
import { CategoriesModule } from 'src/categories/module/categories.module';

@Module({
  imports: [forwardRef(() => CategoriesModule)],
  controllers: [SubcategoriesController],
  providers: [...SubcategoriesProvider, SubcategoriesService],
  exports: [...SubcategoriesProvider],
})
export class SubcategoriesModule {}
