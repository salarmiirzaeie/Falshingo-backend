const { Router } = require("express");

const userController = require("../controllers/userController");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

router.post("/login", userController.handleLogin);

router.post("/register", userController.createUser);

module.exports = router;
