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
import { SubcategoriesService } from '../service/subcategories.services';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { SubcategoriesRequestDto } from '../dto/subcategoriesRequest.dto';

//@UseGuards(JwtAuthGuard)
@Controller('subcategories')
export class SubcategoriesController {
  constructor(
    private readonly subcategoriesService: SubcategoriesService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createSubcategory(
    @Body() requestDto: SubcategoriesRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const subcategory = await this.subcategoriesService.create(requestDto);
      return this.errorMessageService.success(
        subcategory,
        true,
        'Subcategory created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':id')
  async updateSubcategory(
    @Param('id') id: string,
    @Body() requestDto: Partial<SubcategoriesRequestDto>,
  ): Promise<SuccessResponseDto> {
    try {
      const subcategory = await this.subcategoriesService.update(
        id,
        requestDto,
      );
      return this.errorMessageService.success(
        subcategory,
        true,
        'Subcategory updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get('category/:category_id')
  async getSubcategoriesByCategory(
    @Param('category_id') category_id: string,
  ): Promise<SuccessResponseDto> {
    try {
      const subcategories = await this.subcategoriesService.get(category_id);
      return this.errorMessageService.success(
        subcategories,
        true,
        'Subcategories retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get()
  async getAllSubcategories(@Query() query: any): Promise<any> {
    try {
      return await this.subcategoriesService.getAllSubcategories(query);
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Delete(':id')
  async deleteSubcategory(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.subcategoriesService.deleteSubcategory(id);
      return this.errorMessageService.success(
        result,
        true,
        'Subcategory deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
