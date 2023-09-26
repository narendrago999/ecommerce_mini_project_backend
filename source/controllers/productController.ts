// src/controllers/UserController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import { ProductDetails } from "../models/ProductDetails";
import { Cart } from "../models/Cart";
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const url = require("url");
const dotenv = require("dotenv");
dotenv.config();
const jwt_secreat_key = process.env.JWT_KEY;
class ProductController {
 public async get_products(req:Request,res:Response){
    try {
        const product_details = await ProductDetails.findAll()
        res.status(200).json({data :product_details})
    } catch (error) {
        console.log(error);
    }
 }
 public async get_cart(req:Request,res:Response){
     const user = req.body
     console.log("user cart data",user);
     try{
         const cart_data = await Cart.findAll({where:{user_id:user.userExist.user_email}})
         console.log("cartData",cart_data);
         
         res.status(200).json({data:cart_data})
     }catch(error){
        console.log(error);
        
     }
     

     
 }


 public async delete_cart(req:Request, res:Response){
    const user = req.body
    const id = req.params.id
    console.log("delete cart user",user, id)
    try {
        await Cart.destroy({where:{[Op.and]:[{id:id},{user_id:user.userExist.user_email}]}}).then((deletedCount)=>{
            if (deletedCount > 0) {
                res.status(200).json({message:"Deleted Success"})
              } 
        })
    } catch (error) {
        console.log(error);
    }
 }



}
export const productController = new ProductController();
