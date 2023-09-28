export {};
import { productController } from "../controllers/productController";
const {token_verify} = require('../middleware/jwtverify');
const { Router } = require("express");
const { userController } = require("../controllers/userController");
const productRouter = new Router();

productRouter.get("/get-products",productController.get_products);
productRouter.get("/address-form",token_verify,productController.address_form);



module.exports = productRouter;
