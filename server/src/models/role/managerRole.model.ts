import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/db";


export class ManagerRole extends Model {
  declare roleType: "moderator" | "curator" | "expert";
  declare managerId: number;
  declare organizationId: number;
}

ManagerRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    guid: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Roles",
    timestamps: true, // createdAt, updatedAt
  }
);