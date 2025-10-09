/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesRequestDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
}
