const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    idProducto: {type: mongoose.Schema.ObjectId, ref:'Producto'},
    nombreProducto: {type: String, ref:'Producto'},
    precio: {type: Number, ref:'Producto'},
    descripcion: String
});

module.exports = mongoose.model('Menu', menuSchema);