import { Model, DataTypes, type Optional } from "sequelize";
import sequelize from "../../db/db";

interface OrganizationAttributes {
  id: number;
  guid: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  inn: string;
  kpp: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type RealOrganizationAttributes = Optional<OrganizationAttributes, "id" | "guid"> 

export class Organization extends Model<RealOrganizationAttributes>
  implements OrganizationAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description: string;
  declare address: string;
  declare phone: string;
  declare email: string;
  declare inn: string;
  declare kpp: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  toJSON(): any {
    const values = { ...this.get() } as any;

    delete values.id;
    
    return values;
  }
}

Organization.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    inn: { type: DataTypes.STRING, allowNull: false },
    kpp: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "Organizations", timestamps: true }
);