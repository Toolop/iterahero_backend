const pool = require("../config/db");

const validate = async (decoded, request, h) => {
  let isValidated = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."user" WHERE email=$1 AND role = $2',
      [decoded.email, decoded.role]
    );
    if (result.rows[0]) {
      isValidated = true;
    } else {
      isValidated = false;
    }
  } catch (err) {
    isValidated = false;
    console.log(err);
  }
  return { isValid: isValidated };
};

const generateJwt = (jwt, _email, _id_user, _role) =>
  jwt.sign(
    {
      email: _email,
      id_user: _id_user,
      role: _role
    },
    process.env.JWT_SECRET
  );

module.exports = { validate, generateJwt };
