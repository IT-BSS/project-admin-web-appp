import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/db";

export class Role extends Model {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Role.init(
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