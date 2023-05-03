const express = require("express");
const user = express.Router();
const { userSignUp, userLogin } = require("../Controllers/UserController");

user.post("/signup", userSignUp);
user.post("/login", userLogin);

module.exports = user;
