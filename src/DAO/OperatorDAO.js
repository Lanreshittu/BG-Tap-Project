const pool = require("../Config/Db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  validateOperatorData,
  validateOperatorProfileData,
  validateOperatorChoice,
} = require("../Services/OperatorServices");
const {
  getUserIdFromToken,
  getOperatorRegIdFromToken,
} = require("../Utils/Token");
const fs = require("fs");
const { log } = require("console");

const createOperator = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      await validateOperatorData(req);
      const { email, password } = req.body;
      const user_id = await getUserIdFromToken(req);

      const conn = await pool.connect();
      const sql = `INSERT INTO operators(email, password,user_id)
                      VALUES ($1, $2,$3)
                      RETURNING *;`;

      const hash = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS)
      );
      const result = await conn.query(sql, [email, hash, user_id]);
      conn.release();
      resolve(result.rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

const loginOperator = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = req.body;

      const conn = await pool.connect();
      const sql = "SELECT * FROM operators WHERE email =($1);";
      const result = await conn.query(sql, [email]);
      const operator = result.rows[0];
      conn.release();
      if (!operator) {
        reject("Operator does not exist");
      } else {
        const passwordMatch = bcrypt.compareSync(
          password + process.env.BCRYPT_PASSWORD,
          operator.password
        );
        if (passwordMatch) {
          const tokenPayload = {
            user: operator,
          };
          const secretKey = process.env.JWT_OPERATOR_SECRET;
          const expiresIn = 36000;

          const token = jwt.sign(tokenPayload, secretKey, { expiresIn });

          resolve({
            operator: {
              reg_id: operator.opeartor_regid,
            },
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

const verifyOperator = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { isverified } = req.body;
      const { opeartor_regid } = req.params;

      const conn = await pool.connect();
      const sqlCheck = "SELECT * from operators where opeartor_regid =($1);";
      const resultCheck = await conn.query(sqlCheck, [opeartor_regid]);
      const rowsCheck = resultCheck.rows[0];
      if (!rowsCheck) {
        reject("No operator with this ID");
      }
      if (typeof isverified != "boolean") {
        reject(
          "isverified status must be set to boolean true/false and not a string"
        );
      } else {
        const sql =
          "UPDATE operators SET isverified = ($1) WHERE opeartor_regid = ($2) RETURNING *;";
        const result = await conn.query(sql, [isverified, opeartor_regid]);
        const rows = result.rows[0];

        conn.release();
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const completeOperatorRegistration = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const opeartor_regid = await getOperatorRegIdFromToken(req);
      const {
        firstname,
        lastname,
        phonenumber,
        nationality,
        state_id,
        lga_id,
        sex,
        dateofbirth,
        nin,
      } = req.body;
      const picture = fs.readFileSync(req.file.path);
      await validateOperatorProfileData(req);

      const conn = await pool.connect();

      const checkSql =
        "select * from operatorsprofile where opeartor_regid = ($1)";
      const checkValues = [opeartor_regid];
      const checkResult = await conn.query(checkSql, checkValues);
      const operatorProfile = checkResult.rows[0];

      if (!operatorProfile) {
        const sql = `INSERT INTO operatorsprofile(
                  firstname,lastname, phonenumber, nationality, state_id, lga_id, sex, dateofbirth, nin, picture, opeartor_regid)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                      RETURNING *;`;

        const values = [
          firstname,
          lastname,
          phonenumber,
          nationality,
          state_id,
          lga_id,
          sex,
          dateofbirth,
          nin,
          picture,
          opeartor_regid,
        ];
        const newPicturePath = `uploads/Operator${opeartor_regid}.png`;

        fs.unlinkSync(req.file.path);
        fs.writeFileSync(newPicturePath, picture);

        const result = await conn.query(sql, values);
        conn.release();

        resolve("profile has been successfully created");
      } else {
        reject("Operator profile has already been completed for this user");
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createOperatorChoice = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const opeartor_regid = await getOperatorRegIdFromToken(req);
      const { product_id, seed_type_id } = req.body;

      const conn = await pool.connect();

      // Get the operator_id
      const productSql =
        "SELECT operator_id FROM operatorsprofile WHERE opeartor_regid = ($1)";

      const operatorResult = await conn.query(productSql, [opeartor_regid]);
      const operator_id = operatorResult.rows[0].operator_id;

      await validateOperatorChoice(req, operator_id);

      ////////
      const sql = `INSERT INTO operators_choice(
                operator_id, product_id, seed_type_id)
                VALUES ($1, $2, $3)
                    RETURNING *;`;

      const values = [operator_id, product_id, seed_type_id];

      const result = await conn.query(sql, values);
      const operatorChoice = result.rows[0];

      conn.release();

      resolve(operatorChoice);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createOperator,
  loginOperator,
  verifyOperator,
  completeOperatorRegistration,
  createOperatorChoice,
};
