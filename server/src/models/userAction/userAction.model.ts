import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface UserActionAttributes {
  id: number;
  guid: string;
  userId: number;
  actionType: string;
  actionDate: Date;
}

export class UserAction extends Model<UserActionAttributes>
  implements UserActionAttributes {
  declare id: number;
  declare guid: string;
  declare userId: number;
  declare actionType: string;
  declare actionDate: Date;
}

UserAction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Users", key: "id" } },
    actionType: { type: DataTypes.STRING, allowNull: false },
    actionDate: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, tableName: "UserActions", timestamps: true }
);