export {};
import { productController } from "../controllers/productController";
const {token_verify} = require('../middleware/jwtverify');
const { Router } = require("express");
const { userController } = require("../controllers/userController");
const productRouter = new Router();

productRouter.get("/get-products",productController.get_products);
productRouter.get("/get-cart",token_verify,productController.get_cart);
productRouter.delete("/delete/:id",token_verify, productController.delete_cart);
// productRouter.get('/verify', userController.verify)

module.exports = productRouter;
