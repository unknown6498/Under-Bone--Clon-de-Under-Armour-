const express = require('express')
const conectarDB = require('./src/utilidades/dataBase')
const cors = require('cors')
const dotenv = require('dotenv')
const rutaProducto = require('./src/rutas/rutaProducto')
const rutaCategoria = require('./src/rutas/rutaCategoria')
const rutaUsuario = require('./src/rutas/rutaUsuario')

dotenv.config()

const app = express()

// Conectar a la base de datos
conectarDB()

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/productos', rutaProducto)
app.use('/api/categorias', rutaCategoria)
app.use('/api/usuarios', rutaUsuario)

app.use((req, res, next) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

app.use((error, req, res, next) => {
    console.error(error.stack)
    res.status(500).json({
        mensaje: 'Error en el servidor',
        error: error.message,
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en ${PORT}`)
})
