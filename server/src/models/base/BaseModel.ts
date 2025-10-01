import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

export abstract class BaseModel<TModelAttributes extends {} = any, TCreationAttributes extends {} = any> extends Model<
  TModelAttributes,
  TCreationAttributes
> {
  declare id: number;
  declare guid: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export const baseModelFields = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  guid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
  },
};