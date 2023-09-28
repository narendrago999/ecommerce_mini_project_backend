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
class UserController {
  private static async checkUser(email: any) {
    if (email) {
      const userExist = await User.findOne({
        where: { user_email: email },
      });
      if (userExist) {
        return true;
      } else {
        return false;
      }
    }
  }
  private static async createJwtToken(userExist: any) {
    const token = await jwt.sign({ userExist }, jwt_secreat_key, {
      expiresIn: "1d",
    });
    return token;
  }
  private static async emailVerificationLink(token: any, hashUser: any) {
    const transporter = await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: hashUser.user_email,
      subject: process.env.SMTP_SUBJECT,
      text: `Please click the following link to verify your email: ${process.env.url}/verify?token=${token}`,
    };
    await transporter.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        console.log(err);
      }
      if (info.response) {
        console.log(info.response);
      }
    });
  }
  private static async verifyToken(token: string) {
    await jwt.verify(token, jwt_secreat_key, async (err: any, decoded: any) => {
      if (err) {
        if (err?.name === "TokenExpiredError") {
          return false;
        }
        console.log(err);
      }
      if (decoded) {
        console.log("decodded", decoded.userExist);
        if (decoded.userExist) {
          const userVerification = await User.findOne({
            where: {
             user_email: decoded.userExist.user_email
            },
          });
          console.log("query : ", userVerification?.dataValues);
          if (userVerification) {
            await User.update(
              { is_activated: true },
              {
                where: {
                  user_email: decoded.userExist.user_email
                },
              }
            );
          }
        }
      }
    });
  }
  public async verify(req: Request, res: Response) {
    const parsedUrl = await url.parse(req.url, true);
    await UserController.verifyToken(parsedUrl.query.token).then(() => {
      setTimeout(()=>{
        res.redirect('http://localhost:3000/signin')
      },1000)
    });
  }
  // User Registration
  public async signup_user(req: Request, res: Response) {
     
    const userInfo = req.body;
    try {
      if (
        userInfo.user_email != "" &&
        userInfo.first_name != "" &&
        userInfo.last_name != "" &&
        userInfo.password != ""
      ) {
        const userExist: boolean | undefined = await UserController.checkUser(
          userInfo.user_email
        );
        console.log(userExist);

        if (userExist) {
          res.status(200).json({ message: "User Already Exists" });
        } else {
          await bcrypt.hash(
            userInfo.password,
            10,
            async (err: any, hash: any) => {
              if (err) {
                res.status(500).json({ message: "Server Error" });
              }
              if (hash) {
                console.log(hash);

                userInfo.password = hash;
                console.log("userInfo", userInfo);

                const token = await UserController.createJwtToken(userInfo);
                await UserController.emailVerificationLink(
                  token,
                  userInfo
                ).then(async () => {
                  await User.create(userInfo)
                    .then((userCreated: any) => {
                      res.status(200).json({ message: "Email Sent" });
                    })
                    .catch((error) => {
                      res.status(200).json({ message: "Error creating user" });
                    });
                });
              }
            }
          );
        }
      } else {
        res.status(200).json({ message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  private static async get_user(email:string){
    const user  =  await User.findOne({where:{user_email:email}})
    return user?.dataValues
  }
  private static async validate_user(email: string, password: string){
    try {
      const user_exists:boolean|undefined = await UserController.checkUser(email)
      if(user_exists){
        const user = await UserController.get_user(email)
        const result = await bcrypt.compare(password,user.password)
          console.log("result", result)
          console.log("result", user.is_activated)
          if(result && user.is_activated){
            return true
          }else{
            return false
          }
      }else{
        return false
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  // User Login
  public async signin_user(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (email && password) {
        const validate_user:boolean|undefined = await UserController.validate_user(email,password)
        if(validate_user){
          const user = await UserController.get_user(email)
          const token = await UserController.createJwtToken(user)
          res.status(200).json({success:true,token})
        }else{
          res.status(200).json({success:false})
        }
      } else {
        res.status(200).json({ message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export const userController = new UserController();
