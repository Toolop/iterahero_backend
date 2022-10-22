const mqtt = require('mqtt')
const sensor = require('../models/model-sensor');

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`;

const subscribeSensor = () =>{
    try{
            const client = mqtt.connect(connectUrl, {
                clientId,
                keepalive: 30,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                connectTimeout: 30 * 1000,
                rejectUnauthorized: false,
                    
                    //uncomment if need username or password
                    //   username: 'emqx',
                    //   password: 'public',
                reconnectPeriod: 1000,
            });
            const topic = "iterahero/sensor/#"
            client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            })

            client.on('message', (topic, payload) => {
                try{
                    let getData = JSON.parse((payload.toString()));
                    console.log(getData);
                    let save = sensor.insertMany(getData);
    
                    if(save){
                        console.log('berhasil');
                    }else{
                        console.log('failure');
                    }   

                }catch(err){
                    console.log(err);
                }
            });
            
    }catch(err){
        console.log(err);
    }
}

module.exports = {subscribeSensor};