import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../db/db";

export class User extends Model {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare surname: string;
  declare middleName: string;
  declare birthday: Date;
  declare login: string;
  declare email: string;
  declare phone: string;
  declare passwordHash: string;
  declare passportData: string;
  declare isBanned: boolean;
  declare accessToken: string;
  declare refreshToken: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  toJSON() {
    const values = { ...this.get() };
    
    delete values.id;
    delete values.passwordHash;
    delete values.passportData;

    return values;
  }
}

User.init(
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
    surname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    middlename: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false
    },
    login: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
    passwordHash: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    passportData: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true, // createdAt, updatedAt
  }
);