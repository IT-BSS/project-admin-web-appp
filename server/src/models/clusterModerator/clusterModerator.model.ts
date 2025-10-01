import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface ClusterModeratorAttributes {
  id: number;
  guid: string;
  clusterId: number;
  userId: number;
}

export class ClusterModerator extends Model<ClusterModeratorAttributes>
  implements ClusterModeratorAttributes {
  declare id: number;
  declare guid: string;
  declare clusterId: number;
  declare userId: number;
}

ClusterModerator.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    clusterId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Clusters", key: "id" } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
  },
  { sequelize, tableName: "ClusterModerators", timestamps: true }
);