import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface ProjectCuratorAttributes {
  id: number;
  guid: string;
  projectId: number;
  userId: number;
}

export class ProjectCurator extends Model<ProjectCuratorAttributes>
  implements ProjectCuratorAttributes {
  declare id: number;
  declare guid: string;
  declare projectId: number;
  declare userId: number;
}

ProjectCurator.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    projectId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Projects", key: "id" } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  },
  { sequelize, tableName: "ProjectCurators", timestamps: true }
);