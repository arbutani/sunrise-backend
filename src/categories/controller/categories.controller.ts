/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { CategoriesService } from '../service/categories.service';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';

//@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createCategory(
    @Body() requestDto: CategoriesRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const category = await this.categoriesService.createCategory(requestDto);
      return this.errorMessageService.success(
        category,
        true,
        'Category created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() requestDto: CategoriesRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const category = await this.categoriesService.updateCategory(
        id,
        requestDto,
      );
      return this.errorMessageService.success(
        category,
        true,
        'Category updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get(':id')
  async getCategory(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const category = await this.categoriesService.getCategory(id);
      return this.errorMessageService.success(
        category,
        true,
        'Category retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get()
  async getAllCategories(@Query() query: any): Promise<any> {
    try {
      return await this.categoriesService.getAllCategories(query);
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.categoriesService.deleteCategory(id);
      return this.errorMessageService.success(
        result,
        true,
        'Category deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
