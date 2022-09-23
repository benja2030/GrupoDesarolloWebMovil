const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    email: String,
    pass: String,
    telefono: String,
    sexo: String,
    idPerfil: {type: mongoose.Schema.ObjectId, ref: 'Perfil'},
    fechaCreacion: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);