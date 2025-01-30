const express = require('express')
const { Categoria } = require('../modelos/categoria')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const listaCategorias = await Categoria.find()
        res.status(200).json({
            count: listaCategorias.length,
            data: listaCategorias,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { nombre } = req.body
        const categoriaAlmacenada = await Categoria.findOne({ nombre })
        if (categoriaAlmacenada) {
            res.status(400).json({ message: 'La categoría ya está almacenada' })
            return
        }
        const nuevaCategoria = new Categoria(req.body)
        await nuevaCategoria.save()
        res.status(201).json(nuevaCategoria)
    } catch (error) {
        console.error('Error al almacenar la categoría:', error)
        res.status(500).json({
            message: 'Ocurrió un error al almacenar la categoría',
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const actualizarCategoria = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(actualizarCategoria)
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar la categoría',
            error: error.message,
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Categoria.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Categoría eliminada correctamente' })
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar la categoría',
            error: error.message,
        })
    }
})

module.exports = router
