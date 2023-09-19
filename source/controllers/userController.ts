// src/controllers/UserController.ts
import { Request, Response } from 'express';
import { User } from '../models/User';
const {Op} = require('sequelize')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const url = require('url')
const dotenv = require('dotenv')
dotenv.config()
class UserController {
  // User Registration
  public async registerUser(req:Request,res:Response){
    console.log("here")

  }
}
export const userController = new UserController();