const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    contraseña: { type: String, required: true },
})

exports.Usuario = mongoose.model('Usuario', usuarioSchema)
