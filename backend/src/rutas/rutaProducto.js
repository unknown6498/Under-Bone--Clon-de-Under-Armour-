const express = require('express')
const { Producto } = require('../modelos/producto')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const listaProductos = await Producto.find()
        res.status(200).json({
            count: listaProductos.length,
            data: listaProductos,
        })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los productos',
            error: error.message,
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body
        const productoAlmacenado = await Producto.findOne({ nombre })
        if (productoAlmacenado) {
            res.status(400).json({ message: 'El producto ya está almacenado' })
            return
        }

        const nuevoProducto = new Producto(req.body)
        await nuevoProducto.save()
        res.status(201).json(nuevoProducto)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Ocurrió un error al almacenar el producto',
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const actualizarProducto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(actualizarProducto)
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el producto',
            error: error.message,
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id)
        res.status(200).json({ mensaje: 'Producto eliminado correctamente' })
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el producto',
            error: error.message,
        })
    }
})

module.exports = router
