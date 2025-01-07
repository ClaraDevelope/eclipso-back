const mongoose = require('mongoose')

const eventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, required: true },
    fecha: { type: Date, required: true },
    ubicacion: { type: String, trim: true, required: true },
    descripcion: { type: String, trim: true, required: false },
    precio: { type: Number, required: false , default: 0},
    cartel: { type: String, trim: true, required: false, default: '/ticket-retro.webp' },
    asistentes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'asistentes'
      }
    ],
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usuarios'
    },
    etiquetas: { type: [String], default: [] }  
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
)


const Evento = mongoose.model('eventos', eventoSchema, 'eventos')
module.exports = Evento