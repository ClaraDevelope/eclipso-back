const { isAuth, isCreator } = require('../../middlewares/auth')
const { uploadEvento } = require('../../middlewares/file')
const {
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento
} = require('../controllers/evento')

const eventoRouter = require('express').Router()

eventoRouter.get('/', getEventos)
// eventoRouter.patch('/:id/auth/:userId', updateEvento)
eventoRouter.get('/:id', getEventoById)
eventoRouter.delete('/:id', isAuth, isCreator, deleteEvento)

module.exports = { eventoRouter }