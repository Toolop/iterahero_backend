const mqtt = require('mqtt')
const actuator = require('../models/model-actuator');
const pool = require("../config/db");
const { isActuatorExist } = require("../utils/actuator-util");
const { isSensorExist } = require("../utils/sensor-utils");

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
            const topic = "iterahero/macaddress/#"
            client.on('connect', () => {
                console.log('Connected')
                client.subscribe([topic], () => {
                    console.log(`Subscribe to topic '${topic}'`)
                })
            });

            client.on('message', async(topic, payload) => {
                try{
                    let getData = JSON.parse((payload.toString()));
                    if(getData[0].id_sensor){
                        if(await !isSensorExist(getData[0].id_sensor)){
                            await pool.query(
                                `INSERT into public."mac_address" (id_sensor, mac_address) VALUES($1,$2) RETURNING *`,
                                [getData[0].id_sensor, getData[0].id_actuator]
                            );
                        }
                    }
                    else if(getData[0].id_actuator){
                        if(await !isActuatorExist(id)){
                            await pool.query(
                                `INSERT into public."mac_address" (id_actuator, mac_address) VALUES($1,$2) RETURNING *`,
                                [getData[0].id_actuator, getData[0].id_actuator]
                            );
                        }
                    }
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