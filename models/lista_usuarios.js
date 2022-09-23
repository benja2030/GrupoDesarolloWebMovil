const mongoose = require('mongoose');

const lista_usuariosSchema = new mongoose.Schema({
    idUsuario: {type: mongoose.Schema.ObjectId, ref: 'Usuario'},
    emailUsuario: {type: String, ref: 'Usuario'},
    fechaCreacion: {type: String, ref: 'Usuario'},
    perfilUsuario: {type: String, ref: 'Perfil'}
});

module.exports = mongoose.model('Lista_Usuarios', lista_usuariosSchema);