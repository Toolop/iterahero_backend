const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./route');
const jwt = require('hapi-auth-jwt2');
const {validate} = require('./utils/jwt-utils');
const mongoose = require('mongoose');
const halo = require('./mqtt/index.js')


const init = async () =>{
    dotenv.config();

    const server = await Hapi.server({
        port: process.env.PORT || 80,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    await server.register(jwt);
    await mongoose.connect(`mongodb+srv://iterahero:${process.env.MONGGOPASSWORD}@iteraherosensors.4e0t2al.mongodb.net/iterahero?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
    });  
  // pengecekan apakah database telah terhubung, jika iya maka akan menampilkan teks sebagai berikut

    server.auth.strategy('jwt', 'jwt',
    { key: process.env.JWT_SECRET, // Never Share your secret key
      expiresIn: '365d',
      validate:validate
    });

    server.auth.default('jwt');

    server.route(routes);
    
    try{
      await server.start();
    }
    catch(err){
        console.log(err);
    }

    console.log(`Server is running on ${server.info.uri}`);
}

init();
