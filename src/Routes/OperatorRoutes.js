const express = require("express");
const operator = express.Router();
const {
  operatorSignup,
  operatorLogin,
  operatorStates,
  operatorLgas,
  operatorRegistrationCompletion,
  operatorChoiceCreation,
} = require("../Controllers/OperatorController");
const multer = require("multer");
const {
  requireMemberRole,
  requireOperator,
  operatorVerificationStatus,
} = require("../Middleware/authorization");

const upload = multer({ dest: "uploads/" });

operator.post("/signup", requireMemberRole, operatorSignup);

operator.post("/login", operatorLogin);

operator.post(
  "/completeregistration",
  requireOperator,
  upload.single("picture"),
  operatorRegistrationCompletion
);

operator.get("/states", operatorStates);

operator.get("/states/:state_id/lgas", operatorLgas);

operator.post(
  "/productselection",
  operatorVerificationStatus,
  operatorChoiceCreation
);

module.exports = operator;
