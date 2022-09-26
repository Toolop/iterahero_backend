const mqtt = require('mqtt');

const client = mqtt.connect("mqtt://test.mosquitto.org", {
        username:'iterahero',
        password:'cuaks123'
    },
);

let topic = 'iterahero/monitoring';

client.on ('connect',function(){
    console.log('connected');
    client.subscribe(topic,function(err){
        if(!err){
            console.log('subscribed');
        }
    });
});
