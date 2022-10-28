const mqtt = require('mqtt')
const actuator = require('../models/model-actuator');

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`;
const subscribeActuator = () =>{
    try{
            const client = mqtt.connect(connectUrl, {
                clientId,
                keepalive: 30,
                protocolId: 'MQTT',
                protocolVersion: 4,
                clean: true,
                connectTimeout: 30 * 1000,
                rejectUnauthorized: false,
                reconnectPeriod: 1000,
            });
            const topic = "iterahero/status/actuator/#"
            client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            });

            client.on('message', async(topic, payload) => {
                try{
                    let getData = JSON.parse((payload.toString()));
                    let save = await actuator.insertMany(getData);

                }catch(err){
                    console.log(err);
                }
            });
            client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            });

            
    }catch(err){
        console.log(err);
    }
}

module.exports = {subscribeActuator};