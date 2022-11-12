const mqtt = require('mqtt')
const pool = require("../config/db");
const sensor = require('../models/model-sensor');
const { getSensor } = require('../utils/sensor-utils');
const { getGreenHouse } = require("../utils/greenhouse-util");
const { getAutomation} = require('../utils/automation-utils');

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

            client.on('message', async(topic, payload) => {
                try{
                    let getData = await JSON.parse((payload.toString()));
                    let save = await sensor.insertMany(getData);
                    let message = "";
                    for (i in getData){
                        const sensor = await  getSensor(getData[i].id_sensor);
                        const id_user = await (getGreenHouse(sensor.id_greenhouse));
                        const list_automation = await (getAutomation(getData[i].id_sensor));
                        let type = "sensor";
                        let status = 0;
                        let detail = `Sensor ${sensor.name} pada greenhouse ${sensor.greenhouse} terjadi masalah`;
                        const created_at = new Date().toLocaleString("en-US", {
                            timeZone: "Asia/Jakarta",
                        });
                        
                        for (i in list_automation){
                            let pubTopic = `iterahero/actuator/${list_automation[i].id_actuator}`;
                            if(list_automation[i].automationStatus == "1"){
                                if(list_automation[i].between == "<" && parseFloat(getData[i].value) < sensor.range_min){
                                    message = list_automation[i].status_lifecycle;
                                }else if(list_automation[i].between == ">" && parseFloat(getData[i].value) > sensor.range_max){
                                    message = list_automation[i].status_lifecycle;
                                }else if(list_automation[i].between == "<" && parseFloat(getData[i].value) > sensor.range_min + parseFloat(list_automation[i].constanta)){
                                    if(list_automation[i].status_lifecycle == "1"){
                                        message = "0";
                                    }
                                }else if(list_automation[i].between == ">" && parseFloat(getData[i].value) < sensor.range_max - parseFloat(list_automation[i].constanta)){
                                    if(list_automation[i].status_lifecycle == "1"){
                                        message = "0";
                                    }
                                }
                                await client.publish(pubTopic, JSON.stringify(message) , { qos: 0, retain: false }, async (error) => {
                                    if (error) {
                                        console.error(error);
                                    }
                                    else{
                                        console.error("on");
                                    }
                                });
                            }
                        }
                        

                        if(parseFloat(getData[i].value) < sensor.range_min  || parseFloat(getData[i].value) > sensor.range_max){
                            if(sensor.notify === "0"){
                                const getNotif = await pool.query(
                                    `INSERT INTO public."notification" (detail, created_at, type, status, id_sensor) VALUES($1,$2,$3,$4,$5) RETURNING *`,
                                    [detail, created_at, type, status, getData[i].id_sensor]
                                );
                                await pool.query(
                                    `INSERT INTO public."receive" (id_user, id_notification) VALUES($1,$2) RETURNING *`,
                                    [id_user.id_user, getNotif.rows[0].id_notification]
                                );
                                await pool.query(
                                    `UPDATE public."sensor" SET "notify"=1 WHERE id_sensor = $1`,
                                    [getData[i].id_sensor]
                                );
                            }
                        }else if(parseFloat(getData[i].value) > sensor.range_min + 4  || parseFloat(getData[i].value) < sensor.range_max - 4){
                            if(sensor.notify === "1"){
                                await pool.query(
                                    'UPDATE public."sensor" SET "notify"=0 WHERE id_sensor = $1',
                                    [getData[i].id_sensor]
                                );
                            }
                        }
                    }
                    
                    /**/
    
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