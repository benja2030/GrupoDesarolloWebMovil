const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    estadoPago: {type: Number, ref:'Pago'},
    estadoOrden: String,
    tipoEntrega: String,
    fecha: String,
    idProductos: [{type: mongoose.Schema.ObjectId, ref:'Carro'}],
    total: {type: Number, ref: 'Carro'},
    idUsuario: {type: mongoose.Schema.ObjectId, ref:'Carro'},
    nombreUsuario: {type: String, ref:'Usuario'},
    emailUsuario: {type: String, ref:'Usuario'},
    direccion:{type: String, ref: 'Usuario'}
});

module.exports = mongoose.model('Orden', ordenSchema);