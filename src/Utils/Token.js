const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.user.id;

      resolve(user_id);
    } catch (error) {
      reject(error);
    }
  });
};

const getOperatorRegIdFromToken = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_OPERATOR_SECRET);
      const { opeartor_regid } = decoded.user;

      resolve(opeartor_regid);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getUserIdFromToken, getOperatorRegIdFromToken };
