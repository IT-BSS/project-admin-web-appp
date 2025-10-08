import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface UserOrganizationRoleAttributes {
  id: number;
  guid: string;
  userId: number;
  organizationId: number;
  roleId: number;
  permissions?: string | null;
}

export class UserOrganizationRole extends Model<UserOrganizationRoleAttributes>
  implements UserOrganizationRoleAttributes {
  declare id: number;
  declare guid: string;
  declare userId: number;
  declare organizationId: number;
  declare roleId: number;
  declare permissions?: string | null;
}

UserOrganizationRole.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    organizationId: { type: DataTypes.INTEGER, allowNull: false },
    roleId: { type: DataTypes.INTEGER, allowNull: false },
    permissions: { type: DataTypes.STRING },
  },
  { sequelize, tableName: "UserOrganizationRoles", timestamps: true }
);