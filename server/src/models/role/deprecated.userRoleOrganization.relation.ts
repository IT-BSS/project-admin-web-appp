import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/db";

import { User } from "../user/user.model";
import { Role } from "./role.model";
import { Organization } from "../organization/organization.model";

export class UserRoleOrganization extends Model {
  declare userId: number;
  declare organizationId: number;
  declare roleId: number
}

UserRoleOrganization.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      primaryKey: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Organization, key: "id" },
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Role, key: "id" },
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "Roles",
    timestamps: true, // createdAt, updatedAt
  }
);