const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    cantidad: { type: Number, required: true },
})

exports.Producto = mongoose.model('Producto', productoSchema)
