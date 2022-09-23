const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    fecha: String,
    total: {type: Number, ref: 'Carro'},
    idUsuario: {type: mongoose.Schema.ObjectId, ref:'Carro'},
    tipoPago: String,
    estado: Number
});

module.exports = mongoose.model('Pago', pagoSchema);