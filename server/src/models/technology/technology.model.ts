import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface TechnologyAttributes {
  id: number;
  guid: string;
  name: string;
  description?: string | null;
}

export class Technology extends Model<TechnologyAttributes> implements TechnologyAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description?: string | null;
}

Technology.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  },
  { sequelize, tableName: "Technologies", timestamps: true }
);