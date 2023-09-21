  // src/models/User.ts
  import { Model, DataTypes } from 'sequelize';
  const sequelize = require("../database/sequelize")
  
  
  class User extends Model {
    public ProductId!: string;
    public ProductName!: string;
    public ProductPrice!: string;
    public ProductCategory!: string;
    public ProductDescription!: string;
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
  