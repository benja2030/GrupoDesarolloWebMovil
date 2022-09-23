const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    idCategoria: {type: mongoose.Schema.ObjectId, ref: 'Categoria'},
    nombreCategoria: {type: String, ref: 'Categoria'}
});

module.exports = mongoose.model('Producto', productoSchema);