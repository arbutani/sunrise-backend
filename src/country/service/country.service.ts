/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Country } from '../entity/country.entity';
import { CountryRequestDto } from '../dto/countryRequest.dto';
import { CountryDto } from '../dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @Inject('COUNTRY_REPOSITORY')
    private readonly countryRepository: typeof Country,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async createCountry(requestDto: CountryRequestDto): Promise<CountryDto> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const existingCountry = await this.countryRepository.findOne({
        where: {
          country_name: requestDto.country_name,
          deletedAt: { [Op.is]: null } as any,
        },
        transaction,
      });

      if (existingCountry) {
        throw this.errorMessageService.GeneralErrorCore(
          'Country with this name already exists',
          200,
        );
      }

      const countryFields = {
        country_name: requestDto.country_name,
        currency_code: requestDto.currency_code,
        conversion_rate: requestDto.conversion_rate,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;

      let country = await this.countryRepository.create(countryFields, {
        transaction,
      });

      country = country.dataValues ? country.dataValues : country;

      await transaction.commit();
      status = true;

      return new CountryDto(country);
    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getCountry(id: string): Promise<CountryDto> {
    try {
      const country = await this.countryRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
      });

      if (!country) {
        throw new NotFoundException('Country not found');
      }

      return new CountryDto(country);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteCountry(id: string): Promise<{ message: string }> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

      const [updatedRows] = await this.countryRepository.update(
        { deletedAt: deletedAt } as any,
        {
          where: {
            id: id,
            deletedAt: { [Op.is]: null },
          } as any,
          transaction: transaction,
        },
      );

      if (updatedRows === 0) {
        throw new NotFoundException('Country not found or already deleted');
      }

      await transaction.commit();
      status = true;

      return { message: 'Country deleted successfully' };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;
    try {
      const columns: any[] = [
        'id',
        'country_name',
        'currency_code',
        'conversion_rate',
        'created_at',
        'updated_at',
      ];

      let where = 'deleted_at IS NULL';

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          const searchConditions: string[] = [];
          for (const column of requestDto.columns) {
            const columnIndex = Number(column.data);
            if (column.searchable != null && column.searchable == 'true' && columns[columnIndex]) {
              searchConditions.push(` ${columns[columnIndex] as string} ILIKE '%${search}%' `);
            }
          }
          if (searchConditions.length > 0) {
            if (where != '') {
              where += ` AND `;
            }
            where += ` (${searchConditions.join(' OR ')}) `;
          }
        }
      }

      if (requestDto.country_name && requestDto.country_name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` country_name ILIKE '%${requestDto.country_name}%' `;
      }

      let query = `SELECT * FROM countries`;
      let countQuery = `SELECT COUNT(*) FROM countries`;

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        const order = requestDto.order[0];
        const orderColumnIndex = Number(order.column);
        if (columns[orderColumnIndex]) {
          orderBy = `${columns[orderColumnIndex] as string} ${order.dir}`;
        }
      }

      if (orderBy == '') {
        orderBy = 'created_at DESC';
      }

      query += ` ORDER BY ${orderBy}`;

      if (requestDto.length && requestDto.start) {
        if (requestDto.length != -1) {
          query += ` LIMIT ${requestDto.length} OFFSET ${requestDto.start}`;
        }
      } else {
        query += ` LIMIT 10 OFFSET 0`;
      }

      await transaction.commit();
      status = true;

      return { query: query, count_query: countQuery };
    } catch (error) {
      if (status == false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllCountries(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0 && requestDto.columns) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count] = await this.sequelize.query(count_query, { raw: true });
        const countRows = count as any;

        const [results] = await this.sequelize.query(query, { raw: true });

        const listData = (results as any[]).map((country: any) => {
          if (country['created_at']) {
            country['created_at'] = moment(country['created_at']).format('DD-MM-YYYY hh:mm A');
          }
          if (country['updated_at']) {
            country['updated_at'] = moment(country['updated_at']).format('DD-MM-YYYY hh:mm A');
          }
          return country;
        });

        return {
          recordsTotal: Number(
            countRows.length > 0 && countRows[0]['count'] !== '' ? countRows[0]['count'] : 0,
          ),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const countries = await this.countryRepository.findAll({
          where: { deletedAt: { [Op.eq]: null } as any },
          order: [['createdAt', 'DESC']],
        });

        if (!countries || countries.length === 0) {
          throw new NotFoundException('No countries found');
        }

        return countries.map((country) => {
          const countryPlain = country.get({ plain: true }) as any;
          return new CountryDto(countryPlain);
        });
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateCountry(id: string, requestDto: CountryRequestDto): Promise<CountryDto> {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    let status = false;

    try {
      const oldCountry = await this.countryRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
        transaction,
      });

      if (!oldCountry) {
        throw new NotFoundException('Country not found');
      }

      const oldCountryPlain = oldCountry.dataValues ? oldCountry.dataValues : oldCountry;

      if (requestDto.country_name && requestDto.country_name !== oldCountryPlain.country_name) {
        const existingCountry = await this.countryRepository.findOne({
          where: {
            country_name: requestDto.country_name,
            deletedAt: { [Op.is]: null } as any,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (existingCountry) {
          throw this.errorMessageService.GeneralErrorCore(
            'Country with this name already exists',
            200,
          );
        }
      }

      const countryFields = {
        country_name: requestDto.country_name,
        currency_code: requestDto.currency_code,
        conversion_rate: requestDto.conversion_rate,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const [updateCount] = await this.countryRepository.update(countryFields, {
        where: { id },
        transaction,
      });

      if (updateCount === 0) {
        throw this.errorMessageService.GeneralErrorCore('Failed to update country', 500);
      }

      await transaction.commit();
      status = true;

      const updatedCountry = await this.countryRepository.findOne({
        where: { id: id, deletedAt: { [Op.is]: null } as any },
      });

      if (!updatedCountry) {
        throw this.errorMessageService.GeneralErrorCore('Failed to fetch updated country', 500);
      }

      return new CountryDto(updatedCountry);
    } catch (error) {
      if (status === false) {
        await transaction.rollback().catch(() => {});
      }
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
