const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    categoria: {type: mongoose.Schema.ObjectId, 
                ref: 'Categoria'}
});

module.exports = mongoose.model('Producto', productoSchema);