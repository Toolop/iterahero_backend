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

    if (result.rows.length > 0) {
      const hashedPassword = result.rows[0].password;

      if (await bcrypt.compare(password, hashedPassword)) {
        let accessToken = generateJwt(jwt, email, result.rows[0].id_user, result.rows[0].role)
        response = h.response({
          code: 200,
          status: "Ok",
          data: {
            email: result.rows[0].email,
            accessToken,
            role: result.rows[0].role
          },
        });
      } else {
        response = h.response({
          code: 401,
          status: "Unauthorized",
          message: "Username or password is incorrect",
        });
      }
    } else {
      response = h.response({
        code: 401,
        status: "Unauthorized",
        message: "User is not registered.",
      });
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
