const pool = require("../Config/Db");
const { expectedKeysChecker, isValidEmail } = require("../Utils/Validations");

//  Description
//  Check that the email provided doesn't exist already

const checkDuplicateEmail = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email } = req.body;

      const conn = await pool.connect();
      const sql = "SELECT email from users;";
      const result = await conn.query(sql);
      const rows = result.rows;
      conn.release();

      const check = rows.find((user) => {
        return user.email.trim() === email.trim();
      });

      resolve(check);
    } catch (error) {
      reject(error);
    }
  });
};

const validateUserData = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, role } = req.body;

      const requiredKeys = ["email", "password", "role"];

      await expectedKeysChecker(req, requiredKeys);

      await isValidEmail(req);

      if (role !== undefined) {
        role = role.trim().charAt(0).toLowerCase() + role.trim().slice(1);
        if (role !== "member" && role !== "admin") {
          reject("role should be 'member' or 'admin' ");
        }
      }

      if (
        email.trim() === "" ||
        password.trim() === "" ||
        !email ||
        !password
      ) {
        reject("email and password must be provided");
      } else if (await checkDuplicateEmail(req)) {
        reject("Email already exists");
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { checkDuplicateEmail, validateUserData };
