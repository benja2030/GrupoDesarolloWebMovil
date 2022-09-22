const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    estadoPago: {type: Number, ref:'Pago'},
    tipoEntrega: String,
    fecha: String,
    productosMenu: [{type: mongoose.Schema.ObjectId, ref:'Carro'}],
    total: {type: Number, ref: 'Carro'},
    usuario: {type: mongoose.Schema.ObjectId, ref:'Carro'}
});

module.exports = mongoose.model('Orden', ordenSchema);