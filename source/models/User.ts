  // src/models/User.ts
import { Model, DataTypes } from 'sequelize';
const sequelize = require("../database/sequelize")


class User extends Model {
  public FirstName!: string;
  public LastName!: string;
  public Employee_Email!: string;
  public Password!: string;
  public is_activated!:boolean;
}
User.init(
  {
    FirstName: {
      type: DataTypes.STRING
    },
    LastName: {
      type: DataTypes.STRING
    },
    User_Email: {
      type: DataTypes.STRING,
      unique:true
    },
    Password: {
      type: DataTypes.STRING
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    tableName: 'Users',
    sequelize,
  }
);

export { User };
