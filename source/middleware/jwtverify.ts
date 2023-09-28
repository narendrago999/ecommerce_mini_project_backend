import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken')
const jwt_secret_key = process.env.JWT_KEY
interface User{
    first_name:string
    last_name:string
    user_email:string
    password:string
    is_activated:boolean
}
declare global {
    namespace Express {
      interface Request {
        user?: User;
      }
    }
  }
export const token_verify =  async (req:Request,res:Response,next: NextFunction)=>{
    const token = req.headers.authorization
    console.log("token", token);
    if(token){
      await jwt.verify(token,jwt_secret_key,(err: any,decoded: object)=>{
          if(err){
              res.status(401).json({message:"Token Not Verified"})
          }
          const user = decoded as User
          req.body = user
          next()
      })
    }else{
      res.status(200).json({message:"Token Not Found"})
    }
}