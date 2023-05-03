const pool = require("../Config/Db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const { validateUserData } = require("../Services/UserServices");

const createUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, role } = req.body;
      await validateUserData(req);
      const conn = await pool.connect();
      const sql = `INSERT INTO users(email, password,role)
                      VALUES ($1, $2,$3)
                      RETURNING *;`;

      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS)
      );
      const result = await conn.query(sql, [email, hash, role || "member"]);
      conn.release();
      resolve(result.rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

const loginUser = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = req.body;

      const conn = await pool.connect();
      const sql = "SELECT * FROM users WHERE email =($1);";
      const result = await conn.query(sql, [email]);
      const user = result.rows[0];
      conn.release();

      if (!user) {
        reject("User does not exist");
      } else {
        const passwordMatch = bcrypt.compareSync(
          password + process.env.BCRYPT_PASSWORD,
          user.password
        );
        if (passwordMatch) {
          const tokenPayload = {
            user: { id: user.user_id, email: user.email, role: user.role },
          };
          const secretKey = process.env.JWT_SECRET;
          const expiresIn = 36000;

          const token = jwt.sign(tokenPayload, secretKey, { expiresIn });

          resolve({
            user: { id: user.user_id, role: user.role },
            token: token,
          });
        } else {
          reject("Invalid password");
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { createUser, loginUser };
