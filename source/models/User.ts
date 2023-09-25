// src/models/User.ts
import { Model, DataTypes } from "sequelize";
const sequelize = require("../database/sequelize");

class User extends Model {
  public FirstName!: string;
  public LastName!: string;
  public Employee_Email!: string;
  public Password!: string;
  public is_activated!: boolean;
}
User.init(
  {
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    user_email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Users",
    sequelize,
  }
);

export { User };
