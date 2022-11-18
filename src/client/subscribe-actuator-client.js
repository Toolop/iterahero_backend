const mqtt = require('mqtt')
const actuator = require('../models/model-actuator');
const pool = require("../config/db");

const host = 'broker.hivemq.com'
const port = '1883'
const clientId = `mqttItera_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`;
const subscribeActuator = async() =>{
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
            await client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            });

            client.on('message', async(topic, payload) => {
                try{
                    let getData = JSON.parse((payload.toString()));
                    console.log(getData);
                    if(getData[0].status == "offline"){
                        await pool.query(
                            `UPDATE public."actuator" SET "status_lifecycle"=$1 WHERE id_actuator = $2`,
                            [0, getData[0].id_actuator]
                        );
                    }
                    let save = await actuator.insertMany(getData);

                }catch(err){
                    console.log(err);
                }
            });            
    }catch(err){
        console.log(err);
    }
}

module.exports = {subscribeActuator};