/* eslint-disable prettier/prettier */

import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductsRequestDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Selling price is required' })
  @IsNumber({}, { message: 'Selling price must be a valid number' })
  @IsPositive({ message: 'Selling price must be positive' })
  @Type(() => Number)
  selling_price: number;

  @IsNotEmpty({ message: 'Shipping charge is required' })
  @IsNumber({}, { message: 'Shipping charge must be a valid number' })
  @IsPositive({ message: 'Shipping charge must be positive' })
  @Type(() => Number)
  shipping_charge: number;

  @IsNotEmpty({ message: 'Minimum purchase is required' })
  @IsNumber({}, { message: 'Minimum purchase must be a valid number' })
  @IsPositive({ message: 'Minimum purchase must be positive' })
  @Type(() => Number)
  mini_purchase: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a valid number' })
  @IsPositive({ message: 'Quantity must be positive' })
  @Type(() => Number)
  qty: number;

  @IsOptional()
  @IsUUID('4', { message: 'Country ID must be a valid UUID' })
  country_id?: string;

  @IsNotEmpty({ message: 'Reorder quantity is required' })
  @IsNumber({}, { message: 'Reorder quantity must be a valid number' })
  @IsPositive({ message: 'Reorder quantity must be positive' })
  @Type(() => Number)
  reorder_qty: number;
}
