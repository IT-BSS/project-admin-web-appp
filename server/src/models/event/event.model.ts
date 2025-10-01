import { Model, DataTypes } from "sequelize";
import sequelize from "../../db/db";

interface EventAttributes {
  id: number;
  guid: string;
  name: string;
  description?: string | null;
  date: Date;
  projectId?: number | null;
}

export class Event extends Model<EventAttributes> implements EventAttributes {
  declare id: number;
  declare guid: string;
  declare name: string;
  declare description?: string | null;
  declare date: Date;
  declare projectId?: number | null;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    guid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, allowNull: false },
    projectId: { type: DataTypes.INTEGER, references: { model: "Projects", key: "id" } },
  },
  { sequelize, tableName: "Events", timestamps: true }
);