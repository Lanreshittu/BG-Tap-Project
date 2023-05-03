const { expectedKeysChecker } = require("./src/Utils/Validations");

const checkCorrectProductAndSeedTypeId = (
  operator_id,
  product_id,
  seed_type_id
) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();
      const productSql = "SELECT * from products ;";
      const productresult = await conn.query(productSql, [product_id]);
      const allProduct = productresult.rows;

      const allSeedTypeSql = "SELECT * from seed_types where product_id=($1);";
      const allSeedTypeResult = await conn.query(allSeedTypeSql, [product_id]);
      const allSeedTypes = allSeedTypeResult.rows;

      if (!allSeedTypes.length)
        reject(
          `Invalid Product_id provided. select a valid product_id from this list of products; ${allProduct}`
        );

      const seedTypeSql =
        "SELECT * from seed_types where seed_type_id =($1) and product_id=($2);";
      const seedTypeResult = await conn.query(seedTypeSql, [
        seed_type_id,
        product_id,
      ]);
      const seedType = seedTypeResult.rows[0];
      if (!seedType)
        reject({
          "Invalid Seed Type_id for product_id provided. Valid Seed_type_id Include":
            allSeedTypes,
        });

      const sql =
        "SELECT * from operator_selections where operator_id =($1) and seed_type_id =($2) and product_id=($3)";
      const result = await conn.query(sql, [
        operator_id,
        seed_type_id,
        product_id,
      ]);
      const operatorSelection = result.rows[0];
      if (operatorSelection) reject("Operator already has this selection");

      resolve(true);
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const validateOperatorChoice = (req, operator_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { product_id, seed_type_id } = req.body;

      const requiredKeys = ["product_id", "seed_type_id"];
      await expectedKeysChecker(req, requiredKeys);

      if (!product_id || !seed_type_id) {
        reject("Product_id and seed_type_id must be provided");
      } else {
        if (!validator.isInt(String(product_id)))
          reject("Invalid Product id. Product_id must be a number");
        if (!validator.isInt(String(seed_type_id)))
          reject("Invalid Seed type id. seed_id must be a number");
        await checkCorrectProductAndSeedTypeId(
          operator_id,
          product_id,
          seed_type_id
        );
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
