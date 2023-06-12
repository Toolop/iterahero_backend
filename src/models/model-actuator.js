const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actuatorSchema = new Schema({
    id_actuator: Number,
    status: String,
},{timestamps: true });

module.exports = mongoose.model('actuator', actuatorSchema);
