const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    nombre: {type: String, ref:'Producto'},
    precio: Number,
    descripcion: String,
    producto: {type: mongoose.Schema.ObjectId, ref:'Producto'}
});

module.exports = mongoose.model('Menu', menuSchema);