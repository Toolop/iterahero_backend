const pool = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const register = async (request, h) => {
  const{
    username,
    email,
    password,
    name,
    created_at,
  } = request.payload;

  let result = '';
  let response = '';
  
    try {
        result = await pool.query(
          'SELECT * FROM public."user" WHERE email=$1',
          [email],
        );
    
        if (result.rows[0]){
          response = h.response({
            code:400,
            status: 'Conflict',
            message: `${email} already exists.`
          });
        }
        else{
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          console.log(hashedPassword);
          response = h.response({
            code: 201,
            status: 'Created',
            data: {
              username: email,
            },
          });
        }

          response.code(201);
        }
    catch (err) {
      response = h.response({
        code: 400,
        status: 'Bad Request',
        message: 'error',
      });
  
      response.code(400);
  
      console.log(err);
    }
    return response;
  };

  module.exports = {
    register
  }