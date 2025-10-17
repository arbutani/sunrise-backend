/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/JwtAuthGuard/jwt_auth.guard';
import { CountryController } from '../controller/country.controller';
import { CountryService } from '../service/country.service';
import { CountryProvider } from '../provider/country.provider';


@Module({
  imports: [],
  controllers: [CountryController],
  providers: [
    CountryService,            
    JwtAuthGuard,
    {
      provide: JwtService,
      useValue: new JwtService({}),
    },
    ...CountryProvider,        
  ],
  exports: [
    ...CountryProvider,        
    CountryService,           
  ],
})
export class CountryModule {}
