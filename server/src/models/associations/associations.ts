import { User } from "../user/user.model";
import { Organization } from "../organization/organization.model";
import { Role } from "../role/role.model";
import { UserOrganizationRole } from "../userOrganizationRole/userOrganizationRole";

export function setupAssociations() {

  // Пользователи, организации и их должности в организациях

  User.belongsToMany(Organization, {
    through: UserOrganizationRole,
    as: "organizations",
    foreignKey: "userId",
    otherKey: "organizationId",
  });

  User.belongsToMany(Role, {
    through: UserOrganizationRole,
    foreignKey: "userId"
  });

  Organization.belongsToMany(User, {
    through: UserOrganizationRole,
    as: "members",
    foreignKey: "organizationId",
    otherKey: "userId",
  });

  Organization.belongsToMany(Role, {
    through: UserOrganizationRole,
    as: "roles",
    foreignKey: "organizationId"
  });

  UserOrganizationRole.belongsTo(User, { foreignKey: "userId" });
  UserOrganizationRole.belongsTo(Organization, { foreignKey: "organizationId" });
  UserOrganizationRole.belongsTo(Role, { foreignKey: "roleId" });

  User.hasMany(UserOrganizationRole, { foreignKey: "userId" });
  Organization.hasMany(UserOrganizationRole, { foreignKey: "organizationId" });
  Role.hasMany(UserOrganizationRole, { foreignKey: "roleId" });

   

}