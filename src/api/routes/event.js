const { isAuth, isCreator } = require('../../middlewares/auth')
const { uploadEvento } = require('../../middlewares/file')
const {
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento,
  getEventosConFiltros
} = require('../controllers/event')

const eventoRouter = require('express').Router()

eventoRouter.get('/', getEventos)
eventoRouter.get('/filtros', getEventosConFiltros)
eventoRouter.patch(
  '/:id/auth/:userId',
  isAuth,
  isCreator,
  uploadEvento,
  updateEvento
)
eventoRouter.get('/:id', getEventoById)
eventoRouter.delete('/:id', isAuth, isCreator, deleteEvento)

module.exports = { eventoRouter }