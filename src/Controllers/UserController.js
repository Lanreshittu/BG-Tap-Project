const { createUser, loginUser } = require("../DAO/UserDAO");

const userSignUp = async (req, res) => {
  try {
    let result = await createUser(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("Error validating user data:", error);
    res.status(409).send({ error });
  }
};

const userLogin = async (req, res) => {
  try {
    let result = await loginUser(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("Error validating user data:", error);
    res.status(409).send({ error });
  }
};
module.exports = { userSignUp, userLogin };
