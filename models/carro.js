const mongoose = require('mongoose');

const carroSchema = new mongoose.Schema({
    /*productosMenu: [{_id: {type: mongoose.Schema.ObjectId, ref:'Menu'},
                nombreProducto: String,
                precioProducto: Number
            }],*/
    idProductos: [{type: mongoose.Schema.ObjectId, ref:'Menu'}],
    total: Number,
    usuario: {type: mongoose.Schema.ObjectId, ref:'Usuario'}
   
});

module.exports = mongoose.model('Carro', carroSchema);