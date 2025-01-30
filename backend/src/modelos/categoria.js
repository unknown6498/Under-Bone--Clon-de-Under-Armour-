const mongoose = require('mongoose')

const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true}
})

exports.Categoria = mongoose.model('Categoria', categoriaSchema)
