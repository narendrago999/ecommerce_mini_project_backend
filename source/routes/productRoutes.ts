import { productController } from "../controllers/productController";

export {};
const { Router } = require("express");
const { userController } = require("../controllers/userController");
const productRouter = new Router();

productRouter.get("/get-products", productController.get_products);
// productRouter.post("/signin", userController.signin_user);
// productRouter.get('/verify', userController.verify)

module.exports = productRouter;
