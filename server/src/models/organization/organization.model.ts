import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface OrganizationAttributes {
  id: number;
  guid: string;
  name: string;
  description?: string | null;
  address?: string | null;
  inn: string;
  kpp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Organization extends Model<OrganizationAttributes>
  implements OrganizationAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description?: string | null;
  declare address?: string | null;
  declare inn: string;
  declare kpp: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Organization.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.STRING },
    inn: { type: DataTypes.STRING, allowNull: false },
    kpp: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Organizations", timestamps: true }
);