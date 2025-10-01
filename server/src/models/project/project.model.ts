import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface ProjectAttributes {
  id: number;
  guid: string;
  name: string;
  description?: string | null;
  passportId?: number | null;
}

export class Project extends Model<ProjectAttributes> implements ProjectAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description?: string | null;
  declare passportId?: number | null;
}

Project.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    passportId: { type: DataTypes.INTEGER, references: { model: "ProjectPassports", key: "id" } },
  },
  { sequelize, tableName: "Projects", timestamps: true }
);