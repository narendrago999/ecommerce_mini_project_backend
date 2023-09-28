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
class CartController {

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
 public async add_cart(req:Request,res:Response){
     const user = req.body
     const id = req.params.id
     try{
         const cart_data:Cart |null = await Cart.findOne({where:{[Op.and]:[{user_id:user.userExist.user_email},{product_id:id}]}})
         console.log("cartData",cart_data);
         if(cart_data){
            res.status(200).json({message:"already added"})
         }else{
            const product = await ProductDetails.findOne({where:{id:id}})
            if(product?.dataValues){
                const cartproduct = {
                    product_id:product.dataValues.id,
                    product_title:product.dataValues.product_title,
                  product_price:product.dataValues.product_price,
                  product_rating:product.dataValues.product_rating,
                  product_category:product.dataValues.product_category,
                  product_brand:product.dataValues.product_brand,
                  product_colour:product.dataValues.product_colour,
                  product_fit_type:product.dataValues.product_fit_type,
                  product_style:product.dataValues.product_style,
                  product_neck_style:product.dataValues.product_neck_style,
                  product_description:product.dataValues.product_description,
                  product_image_url:product.dataValues.product_image_url,
                  user_id:user.userExist.user_email,
                 }
                 await Cart.create(cartproduct).then((AddedProduct)=>{
                    if(AddedProduct){
                        res.status(201).json({message:"success"})
                    }
                 })
            }
         }
         
        
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
                res.status(200).json({data:"Deleted Success"})
            } else{
                  res.status(200).json({data:"Deleted Successfully"})
              }
        })
    } catch (error) {
        console.log(error);
    }
 }



}
export const cartController = new CartController();
