import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface ClusterAttributes {
  id: number;
  guid: string;
  name: string;
  description?: string | null;
  passportId?: number | null;
}

export class Cluster extends Model<ClusterAttributes> implements ClusterAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description?: string | null;
  declare passportId?: number | null;
}

Cluster.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    passportId: { type: DataTypes.INTEGER, references: { model: "ProjectPassports", key: "id" } },
  },
  { sequelize, tableName: "Clusters", timestamps: true }
);