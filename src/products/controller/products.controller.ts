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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { ProductsService } from '../service/products.service';
import { ProductsRequestDto } from '../dto/productsRequest.dto';

//@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  // --- CREATE PRODUCT ---
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createProduct(
    @Body() requestDto: ProductsRequestDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<SuccessResponseDto> {
    try {
      const product = await this.productsService.createProduct(requestDto, photo ?? null);
      return this.errorMessageService.success(
        product,
        true,
        'Product created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  // --- UPDATE PRODUCT ---
  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async updateProduct(
    @Param('id') id: string,
    @Body() requestDto: ProductsRequestDto,
    @UploadedFile() photo?: Express.Multer.File,
  ): Promise<SuccessResponseDto> {
    try {
      const product = await this.productsService.updateProduct(id, requestDto, photo ?? null);
      return this.errorMessageService.success(
        product,
        true,
        'Product updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  // --- GET SINGLE PRODUCT ---
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const product = await this.productsService.getProduct(id);
      return this.errorMessageService.success(product, true, 'Product retrieved successfully', {});
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  // --- GET ALL PRODUCTS ---
  @Get()
  async getAllProducts(@Query() query: any): Promise<any> {
    try {
      return await this.productsService.getAllProducts(query);
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  // --- DELETE PRODUCT ---
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.productsService.deleteProduct(id);
      return this.errorMessageService.success(result, true, 'Product deleted successfully', {});
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
