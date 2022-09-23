const mongoose = require('mongoose');

const lista_ordenesSchema = new mongoose.Schema({
    estadoOrden: {type: String, ref: 'Orden'},
    fechaOrden: {type: String, ref: 'Orden'},
    idOrden: {type: mongoose.Schema.ObjectId, ref: 'Orden'}
});

module.exports = mongoose.model('Lista_Ordenes', lista_ordenesSchema);