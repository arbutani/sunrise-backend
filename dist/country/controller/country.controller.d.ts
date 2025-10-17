import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import { SuccessResponseDto } from 'src/shared/dto/successResponse.dto';
import { CountryService } from '../service/country.service';
import { CountryRequestDto } from '../dto/countryRequest.dto';
export declare class CountryController {
    private readonly countryService;
    private readonly errorMessageService;
    constructor(countryService: CountryService, errorMessageService: ErrorMessageService);
    createCountry(requestDto: CountryRequestDto): Promise<SuccessResponseDto>;
    updateCountry(id: string, requestDto: CountryRequestDto): Promise<SuccessResponseDto>;
    getCountry(id: string): Promise<SuccessResponseDto>;
    getAllCountries(query: any): Promise<any>;
    deleteCountry(id: string): Promise<SuccessResponseDto>;
}
