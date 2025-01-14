const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema(
  {
    userName: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    email: { 
      type: String, 
      trim: true, 
      required: true, 
      unique: true, 
      match: [/\S+@\S+\.\S+/, 'Usa una dirección de email válida']
    },
    phone: { type: String, trim: true, required: false },
    img: { type: String, trim: true, required: false, default: './usuario-avatar.webp' },
    eventosAsistencia: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
    eventosOrganizados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
    eventosFavoritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
    seguidores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: false
      }
    ],
    siguiendo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: false
      }
    ],
    rol: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      trim: true
    },
    fechaNacimiento: { type: Date, required: false },
    fechaRegistro: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    collection: 'usuarios'
  }
);

const Usuario = mongoose.model('usuarios', usuarioSchema, 'usuarios');
module.exports = Usuario;

