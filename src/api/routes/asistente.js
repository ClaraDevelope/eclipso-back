const {
  getAsistentes,
  getAsistenteById,
  registroAsistencia
} = require('../controllers/asistente')

const asistentesRouter = require('express').Router()

asistentesRouter.get('/', getAsistentes)
asistentesRouter.get('/:id', getAsistenteById)
asistentesRouter.post('/eventos/:eventoId/confirmar', registroAsistencia)

module.exports = { asistentesRouter }
