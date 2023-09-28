export {};
// import { productController } from "../controllers/productController";
const {cartController} = require("../controllers/cartController")
// import { cartController } from "../controllers/cartController";
const {token_verify} = require('../middleware/jwtverify');
const { Router } = require("express");
const { userController } = require("../controllers/userController");
const cartRouter = new Router();

cartRouter.get("/get-cart",token_verify,cartController.get_cart);
cartRouter.delete("/delete/:id",token_verify, cartController.delete_cart);
cartRouter.post("/add-cart/:id",token_verify, cartController.add_cart);


module.exports = cartRouter;
