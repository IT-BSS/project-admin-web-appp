import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface UserOrganizationRoleAttributes {
  id: number;
  guid: string;
  userId: number;
  organizationId: number;
  roleId: number;
  permissions?: string;
}

export class UserOrganizationRole extends Model<UserOrganizationRoleAttributes>
  implements UserOrganizationRoleAttributes {
  declare id: number;
  declare guid: string;
  declare userId: number;
  declare organizationId: number;
  declare roleId: number;
  declare permissions?: string;
}

UserOrganizationRole.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    organizationId: { type: DataTypes.INTEGER, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    permissions: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "UserOrganizationRoles", timestamps: true }
);