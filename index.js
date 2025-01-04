require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./src/config/db')
const { mainRouter } = require('./src/api/routes/mainRouter')
const cloudinary = require('cloudinary').v2

const app = express()
app.use(cors())
const PORT = 6262
connectDB()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use(express.json())

app.use('/api/v1', mainRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('RUTA NO ENCONTRADA')
})
app.listen(PORT, () => {
  console.log('escuchando el servidor en http://localhost:' + PORT)
})
