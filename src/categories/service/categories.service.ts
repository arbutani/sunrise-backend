/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { ErrorMessageService } from 'src/shared/services/errormessage.service';
import moment from 'moment';
import { literal, Op, Sequelize } from 'sequelize';
import { Categories } from '../entity/categories.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { CategoriesDto } from '../dto/categories.dto';
import { Subcategories } from 'src/subcategories/entity/subcategories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CATEGORIES_REPOSITORY')
    private readonly categoriesRepository: typeof Categories,
    @Inject('SUBCATEGORIES_REPOSITORY')
    private readonly subcategoriesRepository: typeof Subcategories,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async createCategory(requestDto: CategoriesRequestDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: requestDto.name },
      });

      if (existingCategory) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Category with this name already exists',
          200,
        );
      }

      const categoryFields = {
        name: requestDto.name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        deletedAt: null,
      } as any;

      const category = await this.categoriesRepository.create(categoryFields, {
        transaction,
      });

      await transaction.commit();

      const newCategory = await this.categoriesRepository.findByPk(category.id);

      if (!newCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch created category',
          500,
        );
      }

      return new CategoriesDto(newCategory);
    } catch (error) {
      await transaction.rollback().catch(() => {});
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async updateCategory(id: string, requestDto: CategoriesRequestDto) {
    const transaction = await this.sequelize.transaction();

    try {
      const oldCategory = await this.categoriesRepository.findByPk(id);
      if (!oldCategory) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found',
          404,
        );
      }

      if (requestDto.name !== oldCategory.name) {
        const findCategory = await this.categoriesRepository.findOne({
          where: {
            name: requestDto.name,
            id: { [Op.ne]: id },
          },
        });

        if (findCategory) {
          await transaction.rollback();
          throw this.errorMessageService.GeneralErrorCore(
            'Category with this name already exists',
            200,
          );
        }
      }

      const categoryFields = {
        name: requestDto.name,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      } as any;

      const [updatedCount] = await this.categoriesRepository.update(
        categoryFields,
        { where: { id }, transaction },
      );

      if (updatedCount === 0) {
        await transaction.rollback();
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to update category',
          200,
        );
      }

      await transaction.commit();

      const updatedCategory = await this.categoriesRepository.findByPk(id);

      if (!updatedCategory) {
        throw this.errorMessageService.GeneralErrorCore(
          'Failed to fetch updated category',
          500,
        );
      }

      return new CategoriesDto(updatedCategory);
    } catch (error) {
      await transaction.rollback().catch(() => {});
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async getCategory(id: string) {
    try {
      const category = await this.categoriesRepository.findByPk(id, {
        include: [
          {
            model: this.subcategoriesRepository,
            where: { deletedAt: null },
            required: false,
          },
        ],
      });

      if (!category) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found',
          404,
        );
      }
      return new CategoriesDto(category);
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async queryBuilder(requestDto: any) {
    try {
      const columns = ['id', 'name', 'createdAt'];

      let where = 'deleted_at IS NULL';

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

      if (requestDto.name && requestDto.name != '') {
        if (where != '') {
          where += ` AND `;
        }
        where += ` name ILIKE '%${requestDto.name}%' `;
      }

      let query = `SELECT * FROM categories`;
      let countQuery = `SELECT COUNT(*) FROM categories`;

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
          orderBy += `${order.column} ${order.dir}`;
        }
        const order = requestDto.order[0];
        orderBy = `${columns[order.column]} ${order.dir}`;
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

  async getAllCategories(requestDto?: any) {
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
          results.map(async (category: any) => {
            if (category['created_at']) {
              category['createdAt'] = moment(category['created_at']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            if (category['updated_at']) {
              category['updatedAt'] = moment(category['updated_at']).format(
                'DD-MM-YYYY HH:mm A',
              );
            }
            return category;
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
        const categories = await this.categoriesRepository.findAll({
          where: {
            deletedAt: { [Op.is]: null },
          } as any,
          include: [
            {
              model: this.subcategoriesRepository,
              where: { deletedAt: null },
              required: false,
            },
          ],
        });

        if (!categories || categories.length === 0) {
          throw this.errorMessageService.GeneralErrorCore(
            'No categories found',
            404,
          );
        }
        return categories.map((category) => new CategoriesDto(category));
      }
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      const [updatedRows] = await this.categoriesRepository.update(
        { deletedAt: moment().format('YYYY-MM-DD HH:mm:ss') } as any,
        {
          where: {
            id: id,
            deletedAt: { [Op.is]: null },
          } as any,
        },
      );

      if (updatedRows === 0) {
        throw this.errorMessageService.GeneralErrorCore(
          'Category not found',
          404,
        );
      }

      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw this.errorMessageService.CatchHandler(error);
    }
  }
}
