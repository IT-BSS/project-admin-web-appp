import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/db";

export class Organization extends Model {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description: string;
  declare email: string;
  declare phone: string;
  declare isArchived: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Organization.init(
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
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "organizations",
    timestamps: true, // createdAt, updatedAt
  }
);