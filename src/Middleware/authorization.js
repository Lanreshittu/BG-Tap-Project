const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const requireMemberRole = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role } = decodedToken.user;

    if (role !== "member") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (req.body.email) {
      if (req.body.email !== email) {
        return res.status(401).json({ message: "Invalid email" });
      }
    }
    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const requireAdminRole = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = decodedToken.user;

    if (role !== "admin") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const operatorVerificationStatus = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_OPERATOR_SECRET);
    const { isverified } = decodedToken.user;

    if (isverified !== true) {
      return res.status(401).json({
        message: "You're not a verified operator, wait till you get verified",
      });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const requireOperator = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_OPERATOR_SECRET);

    const { opeartor_regid } = decodedToken.user;

    if (!opeartor_regid) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Tokn" });
  }
};

module.exports = {
  requireMemberRole,
  requireAdminRole,
  operatorVerificationStatus,
  requireOperator,
};
