/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CategoriesDto } from 'src/categories/dto/categories.dto';

export class SubcategoriesRequestDto {
  @IsOptional()
  @IsUUID('4', { message: 'Category ID must be a valid UUID' })
  category_id: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoriesDto)
  categories?: CategoriesDto[];
}
