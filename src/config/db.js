const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('CONECTADO A LA BBDD')
  } catch (error) {
    console.log('ERROR AL CONECTARSE EN LA BBDD')
  }
}

module.exports = { connectDB }
