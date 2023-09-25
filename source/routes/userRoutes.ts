export {};
const { Router } = require("express");
const { userController } = require("../controllers/userController");
const router = new Router();

router.post("/signup", userController.signup_user);
router.post("/signin", userController.signin_user);
router.get('/verify', userController.verify)

module.exports = router;
