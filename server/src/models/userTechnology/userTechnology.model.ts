import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface UserTechnologyAttributes {
  id: number;
  guid: string;
  userId: number;
  technologyId: number;
}

export class UserTechnology extends Model<UserTechnologyAttributes>
  implements UserTechnologyAttributes {
  declare id: number;
  declare guid: string;
  declare userId: number;
  declare technologyId: number;
}

UserTechnology.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
    technologyId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Technologies", key: "id" } },
  },
  { sequelize, tableName: "UserTechnologies", timestamps: true }
);