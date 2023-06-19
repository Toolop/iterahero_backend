const pool = require("../../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateJwt } = require("../../../utils/jwt-utils");

const login = async (request, h) => {
  const { email, password } = request.payload;

  let response = " ";

  try {
    const result = await pool.query(
      `SELECT * from public."user" WHERE email = $1;`,
      [email]
    );

    if (result.rows[0]) {
      const hashedPassword = result.rows[0].password;

      if (await bcrypt.compare(password, hashedPassword)) {
        response = h.response({
          code: 200,
          status: "Ok",
          data: {
            email: result.rows[0].email,
            accessToken: generateJwt(jwt, email, result.rows[0].id_user),
          },
        });
      } else {
        response = h.response({
          code: 401,
          status: "Unauthorized",
          message: "Username or password is incorrect",
        });
      }
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: "Bad Request",
      message: "error",
    });
    response.code(400);

    console.log(err);
  }
  return response;
};

module.exports = {
  login,
};
