const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: String,
    pass: String,
    perfil: {type: mongoose.Schema.ObjectId, ref: 'Perfil'}
    //En este caso, el usuario es la entidad debil. Solo le asociamos 1 perfil al usuario.
});

module.exports = mongoose.model('Usuario', usuarioSchema);