const pool = require("../Config/Db");

const getStates = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = await pool.connect();
      const statesSql = "SELECT * from states;";
      const statesresult = await conn.query(statesSql);
      const allStates = statesresult.rows;

      resolve(allStates);
    } catch (error) {
      reject(error);
    }
  });
};

const getlgas = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { state_id } = req.params;

      const conn = await pool.connect();
      const lgasSql = "SELECT lga_id,lga from lgas where state_id =($1);";
      const lgasresult = await conn.query(lgasSql, [state_id]);
      const allLgas = lgasresult.rows;

      if (!allLgas.length) {
        reject("pass in a valid state id");
      }
      resolve(allLgas);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getStates, getlgas };
