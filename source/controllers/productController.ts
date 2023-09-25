// src/controllers/UserController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import { ProductDetails } from "../models/ProductDetails";
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
     const token = req.headers.authorization
     
 }
}
export const productController = new ProductController();
