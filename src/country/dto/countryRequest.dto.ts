/* eslint-disable prettier/prettier */

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CountryRequestDto {
  @IsNotEmpty({ message: 'Country name is required' })
  @IsString({ message: 'Country name must be a string' })
  country_name: string;

  @IsNotEmpty({ message: 'Currency code is required' })
  @IsString({ message: 'Currency code must be a string' })
  currency_code: string;

 @IsNotEmpty({ message: 'Conversion rate is required' })
 @IsNumber({}, { message: 'Conversion rate must be a valid number' })
 @IsPositive({ message: 'Conversion rate must be positive' }) 
 conversion_rate: number; 
}