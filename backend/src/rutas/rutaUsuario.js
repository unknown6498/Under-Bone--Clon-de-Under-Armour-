const express = require('express')
const { Usuario } = require('../modelos/usuario')
const router = express.Router()
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')

router.get('/', async (req, res) => {
    try {
        const listaUsuarios = await Usuario.find()
        res.status(200).json({
            count: listaUsuarios.length,
            data: listaUsuarios,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/registro', async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body
        const usuarioRegistrado = await Usuario.findOne({ correo })
        if (usuarioRegistrado) {
            res.status(400).json({ message: 'Usuario ya existe' })
            return
        }
        const contraseñaHashed = await argon2.hash(contraseña)
        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contraseña: contraseñaHashed,
        })
        await nuevoUsuario.save()
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            usuario: nuevoUsuario,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/iniciarsesion', async (req, res) => {
    try {
        const { correo, contraseña } = req.body

        if (!correo || !contraseña) {
            return res
                .status(400)
                .json({ mensaje: 'Por favor, completa todos los campos' })
        }

        const usuarioExistente = await Usuario.findOne({ correo })
        if (!usuarioExistente) {
            return res.status(400).json({ mensaje: 'Usuario no registrado' })
        }

        const esValida = await argon2.verify(
            usuarioExistente.contraseña,
            contraseña
        )
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' })
        }

        const token = jwt.sign(
            { id: usuarioExistente._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        return res
            .status(200)
            .json({
                mensaje: 'Inicio de sesión exitoso',
                token,
                nombre: usuarioExistente.nombre,
            })
    } catch (error) {
        return res
            .status(500)
            .json({ mensaje: 'Error al iniciar sesión', error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const actualizarUsuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!actualizarUsuario) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }
        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            usuario: actualizarUsuario,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const eliminarUsuario = await Usuario.findByIdAndDelete(req.params.id)
        if (!eliminarUsuario) {
            res.status(404).json({ message: 'Usuario no encontrado' })
            return
        }
        res.status(200).json({
            message: 'Usuario eliminado exitosamente',
            usuario: eliminarUsuario,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
