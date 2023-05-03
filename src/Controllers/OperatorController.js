const {
  createOperator,
  loginOperator,
  verifyOperator,
  completeOperatorRegistration,
  createOperatorChoice,
} = require("../DAO/OperatorDAO");
const { getStates, getlgas } = require("../DAO/StatesandLgaDAO");

operatorSignup = async (req, res) => {
  try {
    let result = await createOperator(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(409).send({ error });
  }
};

operatorLogin = async (req, res) => {
  try {
    let result = await loginOperator(req);
    res.status(201).json({ result });
  } catch (error) {
    res.status(409).send({ error });
  }
};

operatorVerification = async (req, res) => {
  try {
    let result = await verifyOperator(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("Error validating operator data:", error);
    res.status(409).send({ error });
  }
};

operatorStates = async (req, res) => {
  try {
    let result = await getStates(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("Error retrieving states:", error);
    res.status(409).send({ error });
  }
};

operatorLgas = async (req, res) => {
  try {
    let result = await getlgas(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("Error retrieving Lgas:", error);
    res.status(409).send({ error });
  }
};

operatorRegistrationCompletion = async (req, res) => {
  try {
    let result = await completeOperatorRegistration(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("completion error", error);
    res.status(409).send({ error });
  }
};

operatorChoiceCreation = async (req, res) => {
  try {
    let result = await createOperatorChoice(req);
    res.status(201).json({ result });
  } catch (error) {
    console.log("error creating choice", error);
    res.status(409).send({ error });
  }
};
module.exports = {
  operatorSignup,
  operatorLogin,
  operatorVerification,
  operatorStates,
  operatorLgas,
  operatorRegistrationCompletion,
  operatorChoiceCreation,
};
