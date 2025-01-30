const mongoose = require('mongoose')

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Conectado a MongoDB...')
    } catch (err) {
        console.error(`Error al conectar a MongoDB: ${err.message}`)
        process.exit(1)
    }
}

module.exports = conectarDB
