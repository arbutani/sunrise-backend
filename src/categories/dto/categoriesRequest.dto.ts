/* eslint-disable prettier/prettier */

import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SubcategoriesRequestDto } from 'src/subcategories/dto/subcategoriesRequest.dto';

export class CategoriesRequestDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SubcategoriesRequestDto)
  subcategories?: SubcategoriesRequestDto;
}
