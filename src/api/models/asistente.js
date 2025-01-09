const mongoose = require('mongoose');

const asistenteSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'usuarios', 
      required: false 
    },
    nombre: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    asistencia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'eventos'
    }
  },
  {
    timestamps: true,
    collection: 'asistentes'
  }
);

asistenteSchema.pre('save', async function (next) {
  if (this.userId) {
    const existingAsistente = await Asistente.findOne({ userId: this.userId, asistencia: this.asistencia });
    if (existingAsistente) {
      return next(new Error('El asistente ya está registrado para este evento.'));
    }
  }
  next();
});

const Asistente = mongoose.model('asistentes', asistenteSchema, 'asistentes');
module.exports = Asistente;
