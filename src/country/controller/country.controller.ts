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
import { CountryService } from '../service/country.service';
import { CountryRequestDto } from '../dto/countryRequest.dto';

@UseGuards(JwtAuthGuard)
@Controller('country')
export class CountryController {
  constructor(
    private readonly countryService: CountryService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  @Post()
  async createCountry(
    @Body() requestDto: CountryRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const country = await this.countryService.createCountry(requestDto);
      return this.errorMessageService.success(
        country,
        true,
        'Country created successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Put(':id')
  async updateCountry(
    @Param('id') id: string,
    @Body() requestDto: CountryRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const country = await this.countryService.updateCountry(id, requestDto);
      return this.errorMessageService.success(
        country,
        true,
        'Country updated successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get(':id')
  async getCountry(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const country = await this.countryService.getCountry(id);
      return this.errorMessageService.success(
        country,
        true,
        'Country retrieved successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Get()
  async getAllCountries(@Query() query: any): Promise<any> {
    try {
      return await this.countryService.getAllCountries(query);
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }

  @Delete(':id')
  async deleteCountry(@Param('id') id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.countryService.deleteCountry(id);
      return this.errorMessageService.success(
        result,
        true,
        'Country deleted successfully',
        {},
      );
    } catch (error) {
      throw this.errorMessageService.error(error);
    }
  }
}
