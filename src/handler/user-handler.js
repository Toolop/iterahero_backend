const pool = require('../config/db');

const hello = async (request, h) => {
  
    try {
      var x = 1;
        if (x == 1) {
          response = h.response({
            code: 200,
            status: 'OK',
            message:'hello world'
          });
    
          response.code(200);
        } else {
          response = h.response({
            code: 404,
            status: 'Not Found',
            message: 'User is not found',
          });
    
          response.code(404);
        }
    } catch (err) {
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
    hello
  }