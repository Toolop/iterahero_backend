const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sensorSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    value: Number,
    created_at: String,
    id_sensor: String,
});

//mengekspor model kontakSchema dengan nama kontak
module.exports = mongoose.model('sensor', sensorSchema);
