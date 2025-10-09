/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { Op, Sequelize } from 'sequelize';
import { Subcategories } from '../entity/subcategories.entity';
import { Categories } from 'src/categories/entity/categories.entity';
import { SubcategoriesRequestDto } from '../dto/subcategoriesRequest.dto';
import { SubcategoriesDto } from '../dto/subcategories.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    @Inject('SUBCATEGORIES_REPOSITORY')
    private readonly subcategoriesRepository: typeof Subcategories,
    @Inject('CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof Categories,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async create(requestDto: SubcategoriesRequestDto) {
    try {
      const findCategory = await this.categoriesRepository.findOne({
        where: {
          id: requestDto.category_id,
        },
      });
      if (!findCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found.',
          200,
        );
      }
      const existingSubcategory = await this.subcategoriesRepository.findOne({
        where: {
          name: requestDto.name,
          category_id: requestDto.category_id,
        },
      });
      if (existingSubcategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Subcategory with this name already exists in the specified category.',
          200,
        );
      }

      const fields = {
        category_id: requestDto.category_id,
        name: requestDto.name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const subcategory = await this.subcategoriesRepository.create(fields);
      if (subcategory) {
        return new SubcategoriesDto(subcategory);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to create subcategory.',
          200,
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async update(id: string, requestDto: Partial<SubcategoriesRequestDto>) {
    try {
      const existingSubcategory =
        await this.subcategoriesRepository.findByPk(id);
      if (!existingSubcategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Subcategory not found',
          404,
        );
      }
      if (
        requestDto.category_id &&
        requestDto.category_id !== existingSubcategory.category_id
      ) {
        const newCategory = await this.categoriesRepository.findOne({
          where: {
            id: requestDto.category_id,
          },
        });
        if (!newCategory) {
          throw this.errorMessageService.GeneralErrorCore(
            'New category not found',
            200,
          );
        }
      }
      if (requestDto.name) {
        const categoryIdToCheck =
          requestDto.category_id || existingSubcategory.category_id;
        const duplicateSubcategory = await this.subcategoriesRepository.findOne(
          {
            where: {
              name: requestDto.name,
              category_id: categoryIdToCheck,
              id: { [Op.ne]: id },
            },
          },
        );
        if (duplicateSubcategory) {
          throw this.errorMessageService.GeneralErrorCore(
            'Subcategory with this name already exists in the specified category',
            200,
          );
        }
      }

      const updateFields = {
        ...requestDto,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      await this.subcategoriesRepository.update(updateFields, {
        where: { id: id },
      });

      const updatedSubcategory =
        await this.subcategoriesRepository.findByPk(id);
      if (updatedSubcategory) {
        return new SubcategoriesDto(updatedSubcategory);
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to retrieve updated subcategory',
          200,
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async get(id: string, type: string = 'id') {
    let subcategories;

    if (type === 'id') {
      const subcategory = await this.subcategoriesRepository.findByPk(id, {
        include: [
          {
            model: Categories,
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!subcategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Subcategory not found',
          404,
        );
      }
      return new SubcategoriesDto(subcategory);
    } else if (type === 'category_id') {
      subcategories = await this.subcategoriesRepository.findAll({
        where: {
          category_id: id,
        },
        include: [
          {
            model: Categories,
            attributes: ['id', 'name'],
          },
        ],
      });
      if (!subcategories || subcategories.length === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'No subcategories found for this category',
          404,
        );
      }
      return subcategories.map(
        (subcategory) => new SubcategoriesDto(subcategory),
      );
    } else {
      throw this.errorMessageService.GeneralErrorCore(
        'Invalid type parameter',
        400,
      );
    }
  }

  async deleteSubcategory(id: string) {
    try {
      const subcategory = await this.subcategoriesRepository.findByPk(id);
      if (!subcategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Subcategory not found',
          404,
        );
      }
      const deleted = await this.subcategoriesRepository.destroy({
        where: { id: id },
      });
      if (deleted) {
        return { message: 'Subcategory deleted successfully' };
      } else {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to delete subcategory',
          200,
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getAllSubcategories(requestDto?: any) {
    try {
      if (requestDto && Object.keys(requestDto).length > 0) {
        const { query, count_query } = await this.queryBuilder(requestDto);

        const [count, count_metadata] = await this.sequelize.query(
          count_query,
          {
            raw: true,
          },
        );
        const countRows = count as any;

        const [results, metadata] = await this.sequelize.query(query, {
          raw: true,
        });

        const listData = await Promise.all(
          results.map(async (subcategory: any) => {
            if (subcategory['created_at']) {
              subcategory['createdAt'] = moment(
                subcategory['created_at'],
              ).format('DD-MM-YYYY HH:mm A');
            }
            if (subcategory['updated_at']) {
              subcategory['updatedAt'] = moment(
                subcategory['updated_at'],
              ).format('DD-MM-YYYY HH:mm A');
            }
            return new SubcategoriesDto(subcategory);
          }),
        );

        return {
          recordsTotal: Number(
            countRows.length > 0 && countRows[0]['count'] != ''
              ? countRows[0]['count']
              : 0,
          ),
          recordsFiltered: listData.length,
          data: listData,
        };
      } else {
        const subcategories = await this.subcategoriesRepository.findAll({
          include: [
            {
              model: Categories,
              attributes: ['id', 'name'],
            },
          ],
        });
        if (!subcategories || subcategories.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No subcategories found',
            404,
          );
        }
        return subcategories.map(
          (subcategory) => new SubcategoriesDto(subcategory),
        );
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    try {
      const columns = ['id', 'category_id', 'name', 'created_at', 'updated_at'];

      let where = '';

      if (requestDto.category_id && requestDto.category_id != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` category_id='${requestDto.category_id}' `;
      }

      if (requestDto.name && requestDto.name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` name ILIKE '%${requestDto.name}%' `;
      }

      if (requestDto.search && requestDto.search.value) {
        const search = requestDto.search.value;
        if (search != '') {
          for (const column of requestDto.columns) {
            if (column.searchable != null && column.searchable == 'true') {
              if (where != '') {
                where += ` AND `;
              }
              where += ` ${columns[column.data]} ILIKE '%${search}%' `;
            }
          }
        }
      }

      if (requestDto.id != null && requestDto.id != '') {
        if (where != '') {
          where += ` AND `;
        }
        where = " id='" + requestDto.id + "' ";
      }

      let query = `SELECT * FROM subcategories`;
      let countQuery = `SELECT COUNT(*) as count FROM subcategories`;

      if (where != '') {
        query += ` WHERE ${where}`;
        countQuery += ` WHERE ${where}`;
      }

      let orderBy = '';
      if (requestDto.order && requestDto.order.length > 0) {
        for (const order of requestDto.order) {
          if (orderBy != '') {
            orderBy += ',';
          }
          orderBy += `${columns[order.column]} ${order.dir}`;
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

      return { query: query, count_query: countQuery };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
