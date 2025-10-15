/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CategoriesProvider } from '../provider/categories.provider';
import { CategoriesService } from '../service/categories.service';
import { CategoriesController } from '../controller/categories.controller';
import { SubcategoriesModule } from 'src/subcategories/module/subcategories.module';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';

@Module({
  imports: [forwardRef(() => SubcategoriesModule)],
  controllers: [CategoriesController],
  providers: [
    ...CategoriesProvider,
    CategoriesService,
    JwtAuthGuard,
    {
      provide: JwtService,
      useValue: new JwtService({}),
    },
  ],
  exports: [...CategoriesProvider],
})
export class CategoriesModule {}
