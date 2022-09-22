const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
    nombre: String,
    usuarios: [{type: mongoose.Schema.ObjectId, ref:'Usuario'}]
    
    /*usuarios: [{
        _id: {type: mongoose.Schema.ObjectId, ref:'Usuario'},
        email: String,
        pass: String    
    }]*/
    //El perfil es la entidad fuerte. Los corchetes [] significan que pueden haber varios usuarios en un perfil.
    //Esta relacion se establece en nuestra base de datos a la que nos estamos conectando con mongoose.
});

module.exports = mongoose.model('Perfil', perfilSchema);