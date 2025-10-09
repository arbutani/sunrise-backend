/* eslint-disable prettier/prettier */

import { forwardRef, Module } from '@nestjs/common';
import { CategoriesProvider } from '../provider/categories.provider';
import { CategoriesService } from '../service/categories.service';
import { CategoriesController } from '../controller/categories.controller';
import { SubcategoriesModule } from 'src/subcategories/module/subcategories.module';
@Module({
  imports: [forwardRef(() => SubcategoriesModule)],
  controllers: [CategoriesController],
  providers: [...CategoriesProvider, CategoriesService],
  exports: [...CategoriesProvider],
})
export class CategoriesModule {}
