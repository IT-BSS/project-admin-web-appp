import { Model, DataTypes, type Optional } from "sequelize";
import sequelize from "../../db/db";
import { access } from "fs";

interface UserAttributes {
  id: number;
  guid: string;
  name: string;
  surname: string;
  middlename?: string | null;
  login: string;
  birthDate: string;
  email: string;
  phone: string;
  passwordHash: string;
  passportData?: string | null;
  isBanned: boolean;
  isManager: boolean;
  isAdmin: boolean;
  accessToken?: string | null;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type RealUserAttributes = Optional<UserAttributes,
  "id" | "middlename" | "passportData" | "accessToken" | "refreshToken"
>;

export class User extends Model<RealUserAttributes>
  implements UserAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare surname: string;
  declare middlename?: string | null;
  declare login: string;
  declare birthDate: string;
  declare email: string;
  declare phone: string;
  declare passwordHash: string;
  declare passportData?: string | null;
  declare isBanned: boolean;
  declare isManager: boolean;
  declare isAdmin: boolean;
  declare accessToken?: string | null;
  declare refreshToken?: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  toJSON(): any {
      let values = { ...this.get({ plain: true }) } as any;

      delete values.id;
      delete values.passwordHash;
      delete values.accessToken;
      delete values.refreshToken;
       
      return values;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    middlename: { type: DataTypes.STRING },
    login: { type: DataTypes.STRING, allowNull: false, unique: true },
    birthDate: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    passportData: { type: DataTypes.TEXT },
    isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
    isManager: { type: DataTypes.BOOLEAN, defaultValue: false },
    isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    accessToken: { type: DataTypes.TEXT },
    refreshToken: { type: DataTypes.TEXT },
  },
  { sequelize, tableName: "Users", timestamps: true }
);