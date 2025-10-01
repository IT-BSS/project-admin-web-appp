import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface RoleAttributes {
  id: number;
  guid: string;
  name: string;
}

export class Role extends Model<RoleAttributes> implements RoleAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Roles", timestamps: true }
);