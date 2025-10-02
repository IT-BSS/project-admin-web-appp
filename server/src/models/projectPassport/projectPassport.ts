import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface ProjectPassportAttributes {
  id: number;
  guid: string;
  goals?: string | null;
  tasks?: string | null;
  deadlines?: string | null;
}

export class ProjectPassport extends Model<ProjectPassportAttributes>
  implements ProjectPassportAttributes {
  declare id: number;
  declare guid: string;
  declare goals?: string | null;
  declare tasks?: string | null;
  declare deadlines?: string | null;
}

ProjectPassport.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    goals: { type: DataTypes.TEXT },
    tasks: { type: DataTypes.TEXT },
    deadlines: { type: DataTypes.TEXT },
  },
  { sequelize, tableName: "ProjectPassports", timestamps: true }
);