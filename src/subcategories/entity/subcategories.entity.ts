/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Categories } from 'src/categories/entity/categories.entity';

@Table({
  tableName: 'subcategories',
  timestamps: false,
})
export class Subcategories extends Model<Subcategories> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => Categories)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  category_id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  name: string;

  @CreatedAt
  @Column({
    field: 'created_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    field: 'updated_at',
    type: DataType.DATE,
    allowNull: false,
  })
  declare updatedAt: Date;

  @Column({
    field: 'deleted_at',
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date;

  @BelongsTo(() => Categories)
  declare categories: Categories;
}
