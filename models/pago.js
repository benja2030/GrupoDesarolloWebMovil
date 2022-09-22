const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
    fecha: String,
    total: {type: Number, ref: 'Carro'},
    usuario: {type: mongoose.Schema.ObjectId, ref:'Carro'},
    tipoPago: String
});

module.exports = mongoose.model('Pago', pagoSchema);