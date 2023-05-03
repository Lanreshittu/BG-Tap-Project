// Description
// Validates that just the required keys are inputed in the request body

const expectedKeysChecker = (req, expectedKeysArray) => {
  return new Promise((resolve, reject) => {
    for (const key in req.body) {
      if (!expectedKeysArray.includes(key)) {
        reject(`'${key}' Field not allowed`);
      }
    }
    resolve(true);
  });
};

const isValidEmail = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const { email } = req.body;
      const emailPattern = /^\S+@\S+\.\S+$/;
      const result = emailPattern.test(email);
      if (!result) {
        reject("your email isn't valid");
      }

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { expectedKeysChecker, isValidEmail };
