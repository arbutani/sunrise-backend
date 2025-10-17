import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { Sequelize } from 'sequelize';
import { Country } from '../entity/country.entity';
import { CountryRequestDto } from '../dto/countryRequest.dto';
import { CountryDto } from '../dto/country.dto';
export declare class CountryService {
    private readonly countryRepository;
    private readonly sequelize;
    private readonly errorMessageService;
    constructor(countryRepository: typeof Country, sequelize: Sequelize, errorMessageService: ErrorMessageService);
    createCountry(requestDto: CountryRequestDto): Promise<CountryDto>;
    getCountry(id: string): Promise<CountryDto>;
    deleteCountry(id: string): Promise<{
        message: string;
    }>;
    queryBuilder(requestDto: any): Promise<{
        query: string;
        count_query: string;
    }>;
    getAllCountries(requestDto?: any): Promise<CountryDto[] | {
        recordsTotal: number;
        recordsFiltered: number;
        data: any[];
    }>;
    updateCountry(id: string, requestDto: CountryRequestDto): Promise<CountryDto>;
}
