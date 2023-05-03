const express = require("express");
const admin = express.Router();
const { operatorVerification } = require("../Controllers/OperatorController");

admin.patch("/verifyoperator/:opeartor_regid", operatorVerification);

module.exports = admin;
