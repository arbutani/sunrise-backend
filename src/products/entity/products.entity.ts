/* eslint-disable prettier/prettier */
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';


@Table({
  tableName: 'products',
  timestamps: false,
})
export class Products extends Model<Products> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

   @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

   @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  selling_price: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  shipping_charge: number;

   @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  mini_purchase: number;

   @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  country_id: string;


   @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  qty: number;

   @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  reorder_qty: number;

   @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  photo: string;

   @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare reference_number: string;

  @Column({
    type: DataType.DATEONLY,
  })
  declare reference_number_date: Date;

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

}
