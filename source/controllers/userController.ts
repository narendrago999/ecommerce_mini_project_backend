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
class UserController {
  private static async checkUser(user: any) {
    if (user) {
      const userExist = await User.findOne({
        where: { user_email: user.user_email },
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
              [Op.and]: [
                { EMP_ID: decoded.userExist.EMP_ID },
                { Employee_Email: decoded.userExist.Employee_Email },
              ],
            },
          });
          console.log("query : ", userVerification?.dataValues);
          if (userVerification) {
            await User.update(
              { is_activated: true },
              {
                where: {
                  [Op.and]: [
                    { EMP_ID: decoded.userExist.EMP_ID },
                    { Employee_Email: decoded.userExist.Employee_Email },
                  ],
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
      res.send("<h1>Verification success</h1>");
    });
  }
  // User Registration
  public async signup_user(req: Request, res: Response) {
    //   const product = {
    //      product_title: "T-shirt",
    //    product_price: "$200",
    //    product_rating: 2.5,
    //    product_category: "Men",
    //    product_brand: "Jockey",
    //    product_colour: "Assorted",
    //    product_fit_type: "Regular",
    // product_style: "Solid Style",
    //    product_neck_style: "Round Neck",
    //    product_description: "This is product description",
    //   }
    //   await ProductDetails.create(product)
    const userInfo = req.body;
    try {
      if (
        userInfo.user_email != "" &&
        userInfo.first_name != "" &&
        userInfo.last_name != "" &&
        userInfo.password != ""
      ) {
        const userExist: boolean | undefined = await UserController.checkUser(
          userInfo
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

  // private static async validate_user(email,password){

  // }

  public async signin_user(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (email && password) {
        // const validate_user = UserController.validate_user(email,password)
      } else {
        res.status(200).json({ message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export const userController = new UserController();
