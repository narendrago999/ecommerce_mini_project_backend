  // src/models/User.ts
  import { Model, DataTypes } from 'sequelize';
  const sequelize = require("../database/sequelize")
  
  
  class Cart extends Model {
    public product_title!: string;
    public product_price!: string;
    public product_rating!: number;
    public product_category!: string;
    public product_brand!: string;
    public product_colour!: string;
    public product_fit_type!: string;
    public product_style!: string;
    public product_neck_style!: string;
    public product_description!: string;
    public user_id!: string;
  }
  Cart.init(
    {
      product_title: {
        type: DataTypes.STRING
      },
      product_price: {
        type: DataTypes.STRING,
      },
      product_rating: {
        type: DataTypes.FLOAT
      },
      product_category: {
        type: DataTypes.STRING
      },
      product_brand: {
        type: DataTypes.STRING
      },
      product_colour: {
        type: DataTypes.STRING
      },
      product_fit_type: {
        type: DataTypes.STRING
      },
      product_style: {
        type: DataTypes.STRING
      },
      product_neck_style: {
        type: DataTypes.STRING
      },
      product_description: {
        type: DataTypes.STRING
      },
      user_id:{
        type:DataTypes.STRING,
      }
    },
    {
      tableName: 'Cart',
      sequelize,
    }
  );
  
  export { Cart };
  